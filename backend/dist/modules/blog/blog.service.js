import { Blog } from "./blog.schema.js";
export const blogService = {
    getAllByNewest: () => Blog.find().sort({ createdAt: -1 }),
    getById: (id) => Blog.findById(id),
    getByCreator: (createdBy) => Blog.find({ createdBy }),
    create: (payload) => Blog.create(payload),
    update: (id, payload) => Blog.findByIdAndUpdate(id, payload, { new: true }),
    deleteById: async (id) => {
        const blog = await Blog.findById(id);
        if (!blog)
            return null;
        await blog.deleteOne();
        return blog;
    },
};
