const request = require("supertest");
const userService = require("../../src/services/user-service");
const app = require("../../app");
const jwtService = require("../../src/services/jwt-service");
const postService = require("../../src/services/post-service");

jest.mock("../../src/services/user-service.js");
jest.mock("../../src/services/jwt-service");
jest.mock("../../src/services/post-service.js");

let TOKEN;

beforeAll(() => {
  TOKEN = "test-token";
  const dbData = {
    id: 1,
    email: "john@mail.com",
    firstName: "John",
    lastName: "Doe",
    password: "$2a$12$w12F51MEVuQT.N.g1rAwiemxOSG.AI8r4.8Y03A//PAFt455U1JFW",
    createdAt: "2022-01-01T00:00:00.000Z",
  };
  jwtService.verify.mockReturnValue({ id: 1 });
  userService.findUserById.mockReturnValue(dbData);
});

describe("post controller", () => {
  test("GET /posts should return 200 and array of posts", async () => {
    const samplePosts = [
      {
        id: 1,
        message: "sample post",
        userId: 1,
        user: {
          firstName: "John",
          lastName: "Doe",
        },
        comments: [],
      },
    ];

    postService.getAllPosts.mockReturnValue(samplePosts);

    const response = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(200);
    expect(response.body.posts.length).toEqual(1);
    expect(response.body.posts[0].id).toEqual(1);
    expect(response.body.posts[0].message).toEqual("sample post");
    expect(response.body.posts[0].userId).toEqual(1);
    expect(response.body.posts[0].user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(response.body.posts[0].comments).toEqual([]);
  });

  test("POST /posts should return 201 and created post", async () => {
    const message = { message: "sample post" };

    const samplePost = {
      id: 1,
      message: "sample post",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };

    postService.createPost.mockReturnValue(samplePost);

    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(message);
    expect(response.status).toEqual(201);
    expect(response.body.post.id).toEqual(1);
    expect(response.body.post.message).toEqual("sample post");
    expect(response.body.post.userId).toEqual(1);
    expect(response.body.post.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(response.body.post.comments).toEqual([]);
    expect(response.body.message).toEqual("Post has been created");
  });

  test("POST /posts with empty message should return 400", async () => {
    const message = { message: "" };

    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(message);
    expect(response.status).toEqual(400);
  });

  test("PATCH /posts/:postId should return 200 and updated post", async () => {
    const updateMessage = { message: "update post" };
    const samplePost = {
      id: 1,
      message: "sample post",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };

    postService.findPostById.mockReturnValue(samplePost);
    postService.updatePost.mockReturnValue({
      ...samplePost,
      message: updateMessage.message,
    });

    const response = await request(app)
      .patch(`/posts/${samplePost.id}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(200);
    expect(response.body.post.id).toEqual(1);
    expect(response.body.post.message).toEqual("update post");
    expect(response.body.post.userId).toEqual(1);
    expect(response.body.post.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(response.body.post.comments).toEqual([]);
    expect(response.body.message).toEqual("Post has been updated");
  });

  test("PATCH /posts/:postId with empty message should return 400", async () => {
    const postId = 1;
    const updateMessage = { message: "" };

    const response = await request(app)
      .patch(`/posts/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(400);
  });

  test("PATCH /posts/:postId with invalid postId should return 400", async () => {
    const postId = "invalid";
    const updateMessage = { message: "update post" };
    postService.findPostById.mockReturnValue(null);

    const response = await request(app)
      .patch(`/posts/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual("Post not found");
  });

  test("PATCH /posts/:postId with unauthorized user should return 401", async () => {
    const updateMessage = { message: "update post" };
    const samplePost = {
      id: 1,
      message: "sample post",
      userId: 1000,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };

    postService.findPostById.mockReturnValue(samplePost);

    const response = await request(app)
      .patch(`/posts/${samplePost.id}`)
      .set("Authorization", `Bearer ${TOKEN}`)
      .send(updateMessage);
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual("Unauthorized");
  });

  test("DELETE /posts/:postId should return 204", async () => {
    const samplePost = {
      id: 1,
      message: "sample post",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };

    postService.findPostById.mockReturnValue(samplePost);
    postService.deletePost.mockReturnValue(null);

    const response = await request(app)
      .delete(`/posts/${samplePost.id}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(204);
  });

  test("DELETE /posts/:postId not found post with postId should return 204", async () => {
    const postId = 1;

    postService.findPostById.mockReturnValue(null);

    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(204);
  });

  test("DELETE /posts/:postId with unauthorized user should return 401", async () => {
    const samplePost = {
      id: 1,
      message: "sample post",
      userId: 1000,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };

    postService.findPostById.mockReturnValue(samplePost);

    const response = await request(app)
      .delete(`/posts/${samplePost.id}`)
      .set("Authorization", `Bearer ${TOKEN}`);
    expect(response.status).toEqual(401);
  });
});
