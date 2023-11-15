const express = require("express");
const verifyToken = require("../utils/verifyUser.js");
const {
  updateUserController,
  deleteUserController,
  getUserDetailsController,
} = require("../controllers/user.controller.js");

const userRouter = express.Router();

userRouter.post("/update/:id", verifyToken, updateUserController);
userRouter.delete("/delete/:id", verifyToken, deleteUserController);
userRouter.get("/get/:id",verifyToken,getUserDetailsController);


module.exports = userRouter;
