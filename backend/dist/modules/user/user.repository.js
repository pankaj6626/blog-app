import { User } from "./user.schema.js";
export const userRepository = {
    findByEmail: (email) => User.findOne({ email }),
    findById: (id) => User.findById(id),
    create: (payload) => User.create(payload),
    findAdminUsers: () => User.find({ role: "admin" }),
    updateToken: (id, token) => User.findByIdAndUpdate(id, { token }),
};
