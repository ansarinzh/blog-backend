const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("slug");
const blogSchema = new Schema(
  {
    content: {
      type: String,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    imgUrl: {
      type: String,
    },
    heading: {
      type: String,
    },
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
    },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    imageThumb: { type: Object, required: true },
    status: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
blogSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slugify();
  }
  next();
});
blogSchema.methods.slugify = function () {
  this.slug = slug(this.title);
};

// blogSchema.methods.slugify = function () {
//   this.slug =
//     slug(this.title) +
//     "-" +
//     ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
// };

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;

//image url
//title
//category
