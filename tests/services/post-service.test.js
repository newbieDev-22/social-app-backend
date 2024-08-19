const { prismaMock } = require("../../singleton");
const postService = require("../../src/services/post-service");

describe("post service", () => {
  test("Get All Posts => success", async () => {
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
    prismaMock.post.findMany.mockResolvedValue(samplePosts);
    const allPost = await postService.getAllPosts();
    expect(allPost).toBeTruthy();
    expect(allPost.length).toEqual(1);
    expect(allPost[0].id).toEqual(1);
    expect(allPost[0].message).toEqual("sample post");
    expect(allPost[0].userId).toEqual(1);
    expect(allPost[0].user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(allPost[0].comments).toEqual([]);
  });

  test("Create Post => success", async () => {
    const message = { userId: 1, message: "sample post" };

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

    prismaMock.post.create.mockResolvedValue(samplePost);
    const newPost = await postService.createPost(message);
    expect(newPost).toBeTruthy();
    expect(newPost.id).toEqual(1);
    expect(newPost.message).toEqual("sample post");
    expect(newPost.userId).toEqual(1);
    expect(newPost.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(newPost.comments).toEqual([]);
  });

  test("Update Post => success", async () => {
    const postId = 1;
    const updateMessage = { message: "update post" };
    const samplePost = {
      id: 1,
      message: "update post",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };

    prismaMock.post.update.mockResolvedValue(samplePost);
    const updatePost = await postService.updatePost(postId, updateMessage);
    expect(updatePost).toBeTruthy();
    expect(updatePost.id).toEqual(1);
    expect(updatePost.message).toEqual("update post");
    expect(updatePost.userId).toEqual(1);
    expect(updatePost.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(updatePost.comments).toEqual([]);
  });

  test("Delete Post => success", async () => {
    const postId = 1;
    prismaMock.post.delete.mockResolvedValue(null);
    const deletePost = await postService.deletePost(postId);
    expect(deletePost).toBeNull();
  });

  test("Find Post by Id => success", async () => {
    const postId = 1;
    const samplePost = {
      id: 1,
      message: "update post",
      userId: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
      },
      comments: [],
    };
    prismaMock.post.findUnique.mockResolvedValue(samplePost);
    const findPostById = await postService.findPostById(postId);
    expect(findPostById).toBeTruthy();
    expect(findPostById.id).toEqual(1);
    expect(findPostById.message).toEqual("update post");
    expect(findPostById.userId).toEqual(1);
    expect(findPostById.user).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
    expect(findPostById.comments).toEqual([]);
  });
});
