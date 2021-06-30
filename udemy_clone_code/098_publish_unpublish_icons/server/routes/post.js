import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// middlewares
import { requireSignin, isAuthor, isAdmin } from "../middlewares";
// controller
const {
  uploadImage,
  create,
  list,
  read,
  update,
  remove,
  publishPost,
  unpublishPost,
  postsByAuthor,
  removeByAdmin,
  publishPostByAdmin,
  unpublishPostByAdmin,
  prevPost,
  nextPost,
  listForAdmin,
} = require("../controllers/post");

// image
router.post("/post/upload-image", requireSignin, isAuthor, uploadImage);
// post
router.post("/post", requireSignin, isAuthor, create);
router.get("/posts", list);
router.get("/admin/posts", listForAdmin);
router.get("/posts-by-author", requireSignin, postsByAuthor);
router.get("/post/:slug", read);
router.put("/post/:slug", requireSignin, update);
router.delete("/post/:postId", requireSignin, remove);
// prev next
router.get("/post/previous/:postId", prevPost);
router.get("/post/next/:postId", nextPost);

// publish post
router.put("/post/publish/:postId", requireSignin, publishPost);
// unpublish post
router.put("/post/unpublish/:postId", requireSignin, unpublishPost);

// posts for admin
router.delete("/admin/post/:postId", requireSignin, isAdmin, removeByAdmin);
router.put(
  "/admin/post/publish/:postId",
  requireSignin,
  isAdmin,
  publishPostByAdmin
);
router.put(
  "/admin/post/unpublish/:postId",
  requireSignin,
  isAdmin,
  unpublishPostByAdmin
);

module.exports = router;
