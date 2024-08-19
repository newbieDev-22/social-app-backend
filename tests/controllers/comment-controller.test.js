const request = require("supertest");
const userService = require("../../src/services/user-service");
const app = require("../../app");
const jwtService = require("../../src/services/jwt-service");
const postService = require("../../src/services/post-service");
const commentService = require("../../src/services/comment-service");

jest.mock("../../src/services/user-service.js");
jest.mock("../../src/services/jwt-service");
jest.mock("../../src/services/post-service.js");
jest.mock("../../src/services/comment-service.js");

let TOKEN;

beforeAll(() => {
  TOKEN = "test-token";

  const dbData = {
    id: 2,
    email: "john@mail.com",
    firstName: "John",
    lastName: "Doe",
    password: "$2a$12$w12F51MEVuQT.N.g1rAwiemxOSG.AI8r4.8Y03A//PAFt455U1JFW",
    createdAt: "2022-01-01T00:00:00.000Z",
  };

  jwtService.verify.mockReturnValue({ id: 2 });
  userService.findUserById.mockReturnValue(dbData);
});

describe("comment controller", () => {
  test("GET /comments/post/:postId should return 200 and array of comments", async () => {
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

    const mockPost = {
      id: 1,
      message: "sample post",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [
        {
          id: 1,
          message: "sample comment",
          userId: 2,
          user: {
            firstName: "John",
            lastName: "Doe",
          },
        },
      ],
    };

    postService.findPostById.mockReturnValue(mockPost);
    commentService.getAllComments.mockReturnValue(mockComments);

    const response = await request(app)
      .get(`/comments/post/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(200);
    expect(response.body.comments.length).toEqual(1);
    expect(response.body.comments[0].id).toEqual(1);
    expect(response.body.comments[0].message).toEqual("sample comment");
    expect(response.body.comments[0].userId).toEqual(2);
    expect(response.body.comments[0].user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  test("GET /comments/post/:postId with not found post should return 200 and empty array", async () => {
    const postId = "invalid";

    postService.findPostById.mockReturnValue(null);

    const response = await request(app)
      .get(`/comments/post/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(200);
    expect(response.body.comments.length).toEqual(0);
  });

  test("POST /comments/post/:postId should return 201 and created post", async () => {
    const message = { message: "sample comment" };

    const mockComment = {
      id: 1,
      message: "sample comment",
      userId: 2,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    const mockPost = {
      id: 1,
      message: "sample post",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };

    postService.findPostById.mockReturnValue(mockPost);
    commentService.createComment.mockReturnValue(mockComment);

    const response = await request(app)
      .post(`/comments/post/${mockPost.id}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(message);
    expect(response.status).toEqual(201);
    expect(response.body.comment.id).toEqual(1);
    expect(response.body.comment.message).toEqual("sample comment");
    expect(response.body.comment.userId).toEqual(2);
    expect(response.body.comment.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(response.body.message).toEqual("Comment has been created");
  });

  test("POST /comments/post/:postId with empty message should return 400", async () => {
    const postId = 1;
    const message = { message: "" };

    const response = await request(app)
      .post(`/comments/post/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(message);
    expect(response.status).toEqual(400);
  });

  test("POST /comments/post/:postId with not found post should return 400", async () => {
    const postId = 9999;
    const message = { message: "sample comment" };

    postService.findPostById.mockReturnValue(null);

    const response = await request(app)
      .post(`/comments/post/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(message);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Post not found");
  });

  test("PATCH /comments/:commentId should return 200 and updated comment", async () => {
    const updateMessage = { message: "update comment" };
    const mockComment = {
      id: 1,
      message: "sample comment",
      userId: 2,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    commentService.findCommentById.mockReturnValue(mockComment);
    commentService.updateComment.mockReturnValue({
      ...mockComment,
      message: updateMessage.message,
    });

    const response = await request(app)
      .patch(`/comments/${mockComment.id}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(200);
    expect(response.body.comment.id).toEqual(1);
    expect(response.body.comment.message).toEqual("update comment");
    expect(response.body.comment.userId).toEqual(2);
    expect(response.body.comment.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(response.body.message).toEqual("Comment has been updated");
  });

  test("PATCH /comments/:commentId with empty message should return 400", async () => {
    const commentId = 1;
    const updateMessage = { message: "" };

    const response = await request(app)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(400);
  });

  test("PATCH /comments/:commentId with invalid comment id should return 400", async () => {
    const commentId = "invalid";
    const updateMessage = { message: "update post" };

    commentService.findCommentById.mockReturnValue(null);

    const response = await request(app)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Comment not found");
  });

  test("PATCH /comments/:commentId with unauthorized user should return 401", async () => {
    const commentId = 1;
    const updateMessage = { message: "update post" };
    const mockComment = {
      id: 1,
      message: "sample comment",
      userId: 9999,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    commentService.findCommentById.mockReturnValue(mockComment);

    const response = await request(app)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual("Unauthorized");
  });

  test("DELETE /comments/:commentId should return 204", async () => {
    const mockComment = {
      id: 1,
      message: "sample comment",
      userId: 2,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    commentService.findCommentById.mockReturnValue(mockComment);
    commentService.deleteComment.mockReturnValue(null);

    const response = await request(app)
      .delete(`/comments/${mockComment.id}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(204);
  });

  test("DELETE /comments/:commentId not found comment with comment id should return 204", async () => {
    const commentId = 9999;

    commentService.findCommentById.mockReturnValue(null);

    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(204);
  });

  test("DELETE /comments/:commentId with unauthorized user should return 401", async () => {
    const mockComment = {
      id: 1,
      message: "sample comment",
      userId: 9999,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    commentService.findCommentById.mockReturnValue(mockComment);

    const response = await request(app)
      .delete(`/comments/${mockComment.id}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(401);
  });
});
