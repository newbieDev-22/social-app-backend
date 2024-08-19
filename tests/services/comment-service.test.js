const { prismaMock } = require("../../singleton");
const commentService = require("../../src/services/comment-service");

describe("comment service", () => {
  test("Get comment by Post Id => success", async () => {
    const postId = 1;
    const mockComments = [
      {
        id: 1,
        message: "sample comment",
        userId: 2,
        user: {
          firstName: "John",
          lastName: "Doe",
        },
      },
    ];
    prismaMock.comment.findMany.mockResolvedValue(mockComments);
    const allCommentByPostId = await commentService.getAllComments(postId);
    expect(allCommentByPostId).toBeTruthy();
    expect(allCommentByPostId.length).toEqual(mockComments.length);
    expect(allCommentByPostId[0].id).toEqual(1);
    expect(allCommentByPostId[0].message).toEqual("sample comment");
    expect(allCommentByPostId[0].userId).toEqual(2);
    expect(allCommentByPostId[0].user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  test("Create comment => success", async () => {
    const data = {
      userId: 1,
      postId: 1,
      message: "sample comment",
    };
    const mockComment = {
      id: 1,
      message: "sample comment",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    prismaMock.comment.create.mockResolvedValue(mockComment);
    const newComment = await commentService.createComment(data);
    expect(newComment).toBeTruthy();
    expect(newComment.id).toEqual(1);
    expect(newComment.message).toEqual("sample comment");
    expect(newComment.userId).toEqual(1);
    expect(newComment.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  test("Update comment => success", async () => {
    const commentId = 1;
    const updateMessage = {
      message: "update comment",
    };
    const mockComment = {
      id: 1,
      message: "update comment",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    prismaMock.comment.update.mockResolvedValue(mockComment);
    const updateComment = await commentService.updateComment(commentId, updateMessage);
    expect(updateComment).toBeTruthy();
    expect(updateComment.id).toEqual(1);
    expect(updateComment.message).toEqual("update comment");
    expect(updateComment.userId).toEqual(1);
    expect(updateComment.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  test("Delete comment => success", async () => {
    const commentId = 1;
    prismaMock.comment.delete.mockResolvedValue(null);
    const deleteComment = await commentService.deleteComment(commentId);
    expect(deleteComment).toBeNull();
  });

  test("Find comment by Id => success", async () => {
    const commentId = 1;

    const mockComment = {
      id: 1,
      message: "update comment",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    prismaMock.comment.findUnique.mockResolvedValue(mockComment);

    const findCommentById = await commentService.findCommentById(commentId);
    expect(findCommentById).toBeTruthy();
    expect(findCommentById.id).toEqual(1);
    expect(findCommentById.message).toEqual("update comment");
    expect(findCommentById.userId).toEqual(1);
    expect(findCommentById.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });
});
