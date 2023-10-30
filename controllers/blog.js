import Blog from "../models/Blog.js";

const addBlog = (req, res) => {
    const { title,content, date, userId,userName } = req.body;
    let imgFile;
    if (req.file) {
      imgFile = req.file.filename;
    }

    if (imgFile === undefined && (title == ""||content == "")) {
      //no image no title no
      res.status(401).send({ status: 401, message: "fill the data" });
    } else {
      if (imgFile !== undefined && (title == ""||content == "")) {
        //image but no title or no content
        res.status(401).send({ status: 401, message: "fill the data" });
      } else if (imgFile === undefined && title !== "" && content!== "") {
        // no img but title and content
        const blog =  new Blog({
          userName:userName,
          userId:userId,
          title: title,
          content: content,
          date: date,
        });
        blog.save();
        if (blog) {
            res.status(201).send({ status: 201, blog: blog });
        } else {
            console.log("Something wrong when updating data!");
        }
      } else {
        // both image and title
        const blog =  new Blog({
          userName:userName,
          userId:userId,
          title:title,
          image: imgFile,
          content:content,
          date: date,
        });
        blog.save();
        if (blog) {
            res.status(201).send({ status: 201, blog: blog });
        } else {
            console.log("Something wrong when updating data!");
        }
      }
        
    }
}

const addCmnt = async (req,res)=>{
    const {userId,blogId,comntInput,userName} = req.body;

    const cmntObj = {
        cmnt: comntInput,
        userId: userId,
        userName:userName
       }

    const blog = await Blog.findOneAndUpdate({ _id: blogId },{ $push: { comments: cmntObj} },{new:true}) 

    if(blog){
        res.status(200).send(blog)
    }else{
        console.log("Something wrong when updating data!");
    }
}

const getBlog = async (req,res)=>{
    const {id} = req.params;
    const blog = await Blog.findOne({_id:id})
    if(blog){
        return res?.send(blog)
    }else {
    }
}

const getBlogs = async (req,res)=>{
    try {
      const blogs = await Blog.find({});
    if(blogs){
        return res.status(200).send(blogs.reverse())
    }else {
        return res.status(500).send(err)
    }
    } catch (error) {
      console.log(error);
      res.status(500).send({error})
    }
}
export {addBlog, addCmnt, getBlog, getBlogs}