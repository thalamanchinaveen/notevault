const express = require("express");
const {
  registerController,
  loginController,
  googleController,
  logoutController,
} = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/google", googleController);
authRouter.get("/logout", logoutController);

module.exports = authRouter;
