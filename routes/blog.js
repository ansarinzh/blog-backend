const express = require("express");
const router = express.Router();
const { Blog } = require("../Models/Blog");

const multer = require("multer");
const cloudinary = require("../Utils/Cloudinary");
const { Comment } = require("../Models/Comment");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/uploadfiles", (req, res) => {
  // console.log("reqfiles", res.req.file);
  upload(req, res, (err) => {
    // console.log('rd' ,res.req.file);
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/createPost", async (req, res) => {
  // console.log("reqqqq", req.body.data);
  const { content, title, category, imageThumb } = req.body.data;

  try {
    if (imageThumb) {
      /** upload base64 data into cloudinary */
      // const uploadedResponse =  await cloudinary.uploader.upload(imageThumb, { upload_preset: 'samples/ecommerce' });
      const uploadedResponse = {
        url: "https://cdn.pixabay.com/photo/2018/08/26/23/55/woman-3633737_1280.jpg"
      }

      if (uploadedResponse) {
        const comment = await new Comment({ commentArray: [], bookmark: [] }).save();

        if (!comment) {
          console.log('Error : >>', 'Unable to create comment');
        }
        const blog = new Blog({
          content,
          title,
          category,
          imageThumb: uploadedResponse?.url,
          comment: comment._id
        });

        const savedblog = await blog.save();
        // res.status(200).send(savedblog);

        if (!savedblog)
          return res.status(400).json({ status: "fail", message: "the blog cannot be created!" });
        return res.status(200).json({ status: "Success", data: blog });
      }
    } else {
      console.log('No Images attached');
    }
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ status: "failed", message: 'Unable to create post' });
  }
});

router.get("/getBlogs", async (req, res) => {
  //for pagination
  // const page = parseInt(req.query.page);
  // const limit = parseInt(req.query.limit);
  // const skipIndex = (page - 1) * limit;

  const getallblogs = await Blog.find().sort({ _id: -1 });
  if (!getallblogs) return res.status(400).send("the blogs is not found");
  res.status(200).json({ data: getallblogs });
});

// signel data
router.get("/getsingle/:slug", async (req, res) => {

  const getsignleblog = await Blog.findOne({ slug: req.params.slug }).populate('comment')
  if (!getsignleblog)
    return res.status(400).json({ message: "The User with the given ID was not found." });
  res.status(200).json({ data: getsignleblog });
});

module.exports = router;

// Blog.find()
//   .populate("writer")
//   .exec((err, blogs) => {
//     if (err) return res.status(400).send(err);
//     res.status(200).json({ success: true, blogs });
//   });

// const { auth } = require("../middleware/auth");
//=================================
//             Blog
//=================================

// fieldname: 'file',
// originalname: 'React.png',
// encoding: '7bit',
// mimetype: 'image/png',
// destination: 'uploads/',
// filename: '1573656172282_React.png',
// path: 'uploads/1573656172282_React.png',
// size: 24031
