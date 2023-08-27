const { Blog } = require("../Models/Blog")

const listPostByCategory = async (req, res) => {
    const data = await Blog.find({ category: req.query.category })
    if (!data || data?.length === 0) {
        return res.status(400).json({ message: `No posts found under category ${req.query.category}` })
    }
    return res.status(200).json({ data: data })
}


const searchPosts = async (req, res) => {
    const search_data = await Blog.find({ title: { $regex: req.query.input, $options: "i" } })
    if (!search_data || search_data?.length === 0) {
        return res.status(400).json({ message: `Blogs not found` })
    }
    return res.status(200).json({ data: search_data })
}



module.exports = {
    listPostByCategory, searchPosts
}