const errorHandler = require("./error.js");
const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401 ,"UNAUTHORIZED"))
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
          return next(errorHandler(403 ,"FORBIDDEN"))
        }
        req.user = user;
        next();
      });
    } catch (err) {
      next(err);
    }
  };

  module.exports = verifyToken