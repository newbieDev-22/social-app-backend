const postService = require("../services/post-service");
const createError = require("../utils/create-error");
const tryCatch = require("../utils/try-catch-wrapper");

const postController = {};

postController.createPost = tryCatch(async (req, res, next) => {
  const data = {
    userId: req.user.id,
    message: req.body.message,
  };
  const newPost = await postService.createPost(data);
  res.status(201).json({ message: "Post has been created", post: newPost });
});

postController.getAllPosts = tryCatch(async (req, res, next) => {
  const posts = await postService.getAllPosts();
  res.status(200).json({ posts });
});

postController.updatePost = tryCatch(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postService.findPostById(+postId);
  if (!post) {
    createError({
      message: "Post not found",
      statusCode: 400,
    });
  }

  if (post.userId !== req.user.id) {
    createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  const data = req.body;
  const updatePost = await postService.updatePost(+postId, data);
  res.status(200).json({ message: "Post has been updated", post: updatePost });
});

postController.deletePost = tryCatch(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postService.findPostById(+postId);
  if (!post) {
    createError({
      message: "Post not found",
      statusCode: 400,
    });
  }

  if (post.userId !== req.user.id) {
    createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  await postService.deletePost(+postId);
  res.status(204).end();
});

module.exports = postController;
