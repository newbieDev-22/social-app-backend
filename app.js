require("dotenv").config;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const notFoundMiddleware = require("./src/middlewares/not-found");
const errorMiddleware = require("./src/middlewares/error");
const authRouter = require("./src/routes/auth-route");
const postRouter = require("./src/routes/post-route");
const authenticate = require("./src/middlewares/authenticate");
const commentRouter = require("./src/routes/comment-route");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", authenticate, postRouter);
app.use("/comments", authenticate, commentRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
