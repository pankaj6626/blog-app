import { Blog } from "./blog.schema.js";

export const blogService = {
  getAllByNewest: () => Blog.find().sort({ createdAt: -1 }),
  getById: (id: string) => Blog.findById(id),
  getByCreator: (createdBy: string) => Blog.find({ createdBy }),
  create: (payload: any) => Blog.create(payload),
  update: (id: string, payload: any) => Blog.findByIdAndUpdate(id, payload, { new: true }),
  deleteById: async (id: string) => {
    const blog = await Blog.findById(id);
    if (!blog) return null;
    await blog.deleteOne();
    return blog;
  },
};
