import User from "../models/user";
import Post from "../models/post";
import Category from "../models/category";
// import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { readFileSync } from "fs";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
});

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "post-image-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload to s3
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      // console.log(data); // data.Key
      res.send(data.Location);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.create = async (req, res) => {
  try {
    const { title, body, categories } = req.body;
    // check if title is taken
    const alreadyExist = await Post.findOne({
      slug: slugify(title.toLowerCase()),
    }).exec();
    if (alreadyExist) return res.status(400).send("Title is taken");

    // get category ids based on category name
    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      Category.findOne({ name: categories[i] }).exec((err, cat) => {
        if (err) {
          console.log(err);
        }
        // console.log("cat", cat._id);
        ids.push(cat._id);
      });
    }
    // save post
    setTimeout(async () => {
      const newPost = await new Post({
        title,
        slug: slugify(title.toLowerCase()),
        body,
        categories: ids,
        postedBy: req.user._id,
      }).save();
      return res.json(newPost);
    }, 1000);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error saving. Try again.");
  }
};

export const list = async (req, res) => {
  let posts = await Post.find({ published: true })
    .select("-body")
    .sort({ createdAt: -1 })
    .populate({
      path: "categories",
      select: "name slug",
    })
    .populate("postedBy", "_id name createdAt")
    .exec();
  res.json(posts);
};

export const listForAdmin = async (req, res) => {
  let posts = await Post.find({})
    .select("-body")
    .populate({
      path: "categories",
      select: "name slug",
    })
    .populate("postedBy", "_id name createdAt")
    .exec();
  res.json(posts);
};

export const postsByAuthor = async (req, res) => {
  let posts = await Post.find({ postedBy: req.user._id }).exec();
  res.json(posts);
};

export const read = async (req, res) => {
  //   console.log(req.params);
  const post = await Post.findOne({ slug: req.params.slug })
    .populate("categories")
    .populate("postedBy", "_id name createdAt")
    .exec();
  res.json(post);
};

exports.update = async (req, res) => {
  try {
    const { postId, title, body, categories } = req.body;
    // find post
    const foundPost = await Post.findById(postId).select("postedBy").exec();
    // is owner?
    if (req.user._id != foundPost.postedBy._id) {
      return res.status(400).send("Unauthorized");
    }
    // get category ids based on category name
    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      Category.findOne({ name: categories[i] }).exec((err, cat) => {
        if (err) console.log(err);
        // console.log("cat", cat._id);
        ids.push(cat._id);
      });
    }
    // save post
    setTimeout(async () => {
      let updated = await Post.findOneAndUpdate(
        { slug: req.params.slug },
        {
          title,
          slug: slugify(title),
          body,
          categories: ids,
        }
      );
      res.json({ ok: true });
    }, 1000);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error updating. Try again.");
  }
};

export const remove = async (req, res) => {
  try {
    const { postId } = req.params;
    // find post
    const foundPost = await Post.findById(postId).select("postedBy").exec();
    // is owner?
    if (req.user._id != foundPost.postedBy._id) {
      return res.status(400).send("Unauthorized");
    }

    const removed = await Post.findByIdAndRemove(postId);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error deleting. Try again.");
  }
};

export const publishPost = async (req, res) => {
  try {
    const { postId } = req.params;
    // find post
    const foundPost = await Post.findById(postId).select("postedBy").exec();
    // is owner?
    if (req.user._id != foundPost.postedBy._id) {
      return res.status(400).send("Unauthorized");
    }

    let post = await Post.findByIdAndUpdate(
      postId,
      { published: true },
      { new: true }
    ).exec();
    // console.log("course published", course);
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Publish post failed");
  }
};

export const unpublishPost = async (req, res) => {
  try {
    const { postId } = req.params;
    // find post
    const foundPost = await Post.findById(postId).select("postedBy").exec();
    // is owner?
    if (req.user._id != foundPost.postedBy._id) {
      return res.status(400).send("Unauthorized");
    }

    let post = await Post.findByIdAndUpdate(
      postId,
      { published: false },
      { new: true }
    ).exec();
    // console.log("course published", course);
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unpublish post failed");
  }
};

export const prevPost = async (req, res) => {
  const { postId } = req.params;
  try {
    let post = await Post.find({ _id: { $lt: postId } })
      .select("slug title")
      .sort({ _id: -1 })
      .limit(1)
      .exec();
    console.log("PREV POST", post);
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Request failed");
  }
};

export const nextPost = async (req, res) => {
  try {
    const { postId } = req.params;
    // console.log(postId);
    // return;
    let post = await Post.find({ _id: { $gt: postId } })
      .select("slug title")
      .sort({ _id: 1 })
      .limit(1)
      .exec();
    console.log("NEXT POST", post);
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Request failed");
  }
};

/**
 * by admin
 */

export const removeByAdmin = async (req, res) => {
  try {
    const { postId } = req.params;
    const removed = await Post.findByIdAndRemove(postId);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error deleting. Try again.");
  }
};

export const publishPostByAdmin = async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      { published: true },
      { new: true }
    ).exec();
    // console.log("course published", course);
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Publish post failed");
  }
};

export const unpublishPostByAdmin = async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      { published: false },
      { new: true }
    ).exec();
    // console.log("course published", course);
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Unpublish post failed");
  }
};
