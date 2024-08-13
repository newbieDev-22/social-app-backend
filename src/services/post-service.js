const prisma = require("../models/prisma");

const postService = {};

postService.createPost = (data) => prisma.post.create({ data });
postService.getAllPosts = () => prisma.post.findMany({ orderBy: { createdAt: "desc" } });
postService.updatePost = (postId, data) =>
  prisma.post.update({ where: { id: postId }, data });
postService.deletePost = (postId) => prisma.post.delete({ where: { id: postId } });
postService.findPostById = (postId) => prisma.post.findUnique({ where: { id: postId } });

module.exports = postService;
