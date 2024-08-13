require("dotenv").config;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const authRouter = require("./routes/auth-route");
const postRouter = require("./routes/post-route");
const authenticate = require("./middlewares/authenticate");
const commentRouter = require("./routes/comment-route");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", authenticate, postRouter);
app.use("/comments", authenticate, commentRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
