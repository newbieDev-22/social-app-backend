const prisma = require("../models/prisma");

const commentService = {};

commentService.createComment = (data) => prisma.comment.create({ data });
commentService.getAllComments = (postId) =>
  prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: "desc" } });
commentService.updateComment = (commentId, data) =>
  prisma.comment.update({ where: { id: commentId }, data });
commentService.deleteComment = (commentId) =>
  prisma.comment.delete({ where: { id: commentId } });
commentService.findCommentById = (commentId) =>
  prisma.comment.findUnique({ where: { id: commentId } });

module.exports = commentService;
