const { prisma } = require("../../client");

const commentService = {};

commentService.createComment = (data) =>
  prisma.comment.create({
    select: {
      id: true,
      message: true,
      userId: true,
      user: { select: { firstName: true, lastName: true } },
    },
    data,
  });
commentService.getAllComments = (postId) =>
  prisma.comment.findMany({
    select: {
      id: true,
      message: true,
      userId: true,
      user: { select: { firstName: true, lastName: true } },
    },
    where: { postId },
    orderBy: { createdAt: "asc" },
  });
commentService.updateComment = (commentId, data) =>
  prisma.comment.update({
    select: {
      id: true,
      message: true,
      userId: true,
      user: { select: { firstName: true, lastName: true } },
    },
    where: { id: commentId },
    data,
  });
commentService.deleteComment = (commentId) =>
  prisma.comment.delete({ where: { id: commentId } });
commentService.findCommentById = (commentId) =>
  prisma.comment.findUnique({
    select: { id: true, message: true, userId: true, postId: true },
    where: { id: commentId },
  });

module.exports = commentService;
