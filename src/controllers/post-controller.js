const postService = require("../services/post-service");
const createError = require("../utils/create-error");
const tryCatch = require("../utils/try-catch-wrapper");

const postController = {};

/**
 * Create a new post
 * @name POST /
 * @body {string} message - The content of the post
 * @returns {object} 201 - Success response, The post object
 * @returns {object} 400 - Bad request
 * @returns {Error} - Internal server error
 */
postController.createPost = tryCatch(async (req, res, next) => {
  const data = {
    userId: req.user.id,
    message: req.body.message,
  };
  const newPost = await postService.createPost(data);
  res.status(201).json({ message: "Post has been created", post: newPost });
});

/**
 * Get all posts
 * @name GET /
 * @returns {object} 200 - Success response
 * @returns {object} posts - An array of posts
 * @returns {Error} - Internal server error
 */
postController.getAllPosts = tryCatch(async (req, res, next) => {
  const posts = await postService.getAllPosts();
  res.status(200).json({ posts });
});

/**
 * Update a post
 * @name PATCH /:postId/
 * @body {string} message - The content of the post
 * @returns {object} 200 - Success response, The updated post object
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {Error} - Internal server error
 */
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

/**
 * Delete a post
 * @name DELETE /:postId/
 * @returns {object} 204 - Success response, No content
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {Error} - Internal server error
 */
postController.deletePost = tryCatch(async (req, res, next) => {
  const { postId } = req.params;
  const post = await postService.findPostById(+postId);
  if (!post) {
    return res.status(204).end();
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
