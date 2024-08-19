const request = require("supertest");
const app = require("../../app");

test("GET /not-found should return 404", async () => {
  const response = await request(app).get("/not-found ");
  expect(response.status).toEqual(404);
});
