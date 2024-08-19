const { prisma } = require("../../client");

const postService = {};

postService.createPost = (data) =>
  prisma.post.create({
    select: {
      id: true,
      message: true,
      userId: true,
      user: { select: { firstName: true, lastName: true } },
      comments: {
        select: {
          id: true,
          message: true,
          userId: true,
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
    data,
  });
postService.getAllPosts = () =>
  prisma.post.findMany({
    select: {
      id: true,
      message: true,
      userId: true,
      user: { select: { firstName: true, lastName: true } },
      comments: {
        select: {
          id: true,
          message: true,
          userId: true,
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
postService.updatePost = (postId, data) =>
  prisma.post.update({
    select: { id: true, message: true, userId: true },
    where: { id: postId },
    data,
  });
postService.deletePost = (postId) => prisma.post.delete({ where: { id: postId } });
postService.findPostById = (postId) =>
  prisma.post.findUnique({
    select: { id: true, message: true, userId: true },
    where: { id: postId },
  });

module.exports = postService;
