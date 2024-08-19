const express = require("express");
const { createPostValidator } = require("../middlewares/validator");
const postController = require("../controllers/post-controller");

const postRouter = express.Router();

postRouter.post("/", createPostValidator, postController.createPost);
postRouter.get("/", postController.getAllPosts);
postRouter.patch("/:postId", createPostValidator, postController.updatePost);
postRouter.delete("/:postId", postController.deletePost);

module.exports = postRouter;
