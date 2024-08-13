const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    return res.status(401).json({
      message: err.message,
    });
  }
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    field: err.field,
  });
};

module.exports = errorMiddleware;
