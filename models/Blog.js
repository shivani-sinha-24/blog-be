import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    userName: String,
    userId: String,
    title: String,
    image: String,
    content: String,
    date: String,
    comments: {
        type: Array,
        default: [],
    }
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;