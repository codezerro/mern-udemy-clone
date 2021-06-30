import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

// title slug content excerpt categories postedBy
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 240,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    body: {
      type: {},
      required: true,
      minlength: 200,
      maxlength: 200000,
    },
    published: {
      type: Boolean,
      default: true,
    },
    excerpt: {
      type: String,
      maxlength: 1000,
    },
    categories: [{ type: ObjectId, ref: "Category" }],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
