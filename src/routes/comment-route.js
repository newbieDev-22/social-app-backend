const express = require("express");
const { createCommentValidator } = require("../middlewares/validator");
const commentController = require("../controllers/comment-controller");
const commentRouter = express.Router();

commentRouter.post(
  "/post/:postId/",
  createCommentValidator,
  commentController.createComment
);
commentRouter.get("/post/:postId/", commentController.getAllCommentsInPost);
commentRouter.patch(
  "/:commentId",
  createCommentValidator,
  commentController.updateComment
);
commentRouter.delete("/:commentId", commentController.deleteComment);

module.exports = commentRouter;
