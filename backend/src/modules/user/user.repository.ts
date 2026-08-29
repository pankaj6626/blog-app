import { User } from "./user.schema.js";

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }),
  findById: (id: string) => User.findById(id),
  create: (payload: any) => User.create(payload),
  findAdminUsers: () => User.find({ role: "admin" }),
  updateToken: (id: string, token: string) =>
    User.findByIdAndUpdate(id, { token }),
};
