import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { userRepository } from "../user/user.repository.js";
import { User } from "../user/user.schema.js";
import { env } from "../../config/env.js";

const createTokenAndSaveCookies = async (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  const isProduction = env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  await userRepository.updateToken(userId, token);
  return token;
};

export const authService = {
  register: async (payload: any, file: any, res: Response) => {
    const { email, name, password, phone, education, role } = payload;

    if (!email || !name || !password || !phone || !education || !role || !file) {
      throw new Error("Please fill required fields");
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      email,
      name,
      password: hashedPassword,
      phone,
      education,
      role,
      photo: file,
    });

    const token = await createTokenAndSaveCookies(String(user._id), res);
    return {
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        education: user.education,
        avatar: user.photo?.url,
        createdOn: user.createdAt,
      },
      token,
    };
  },

  login: async (payload: any, res: Response) => {
    const { email, password, role } = payload;

    if (!email || !password || !role) {
      throw new Error("Please fill required fields");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    if (user.role !== role) {
      throw new Error(`Given role ${role} not found`);
    }

    const token = await createTokenAndSaveCookies(String(user._id), res);
    return {
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },
};

export { createTokenAndSaveCookies };
