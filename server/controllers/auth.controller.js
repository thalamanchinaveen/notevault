const User = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { JWT_SECRET_KEY } = process.env;

dotenv.config();

const registerController = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (validUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const hashedPassword = bcrypt.hashSync(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "User Created Successfully" });
  } catch (err) {
    next(err);
  }
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, validUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: validUser._id }, JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("access_token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite : "none",
      secure: true,
    });
    const { password:pass, ...rest } = validUser._doc;
    return res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const googleController = async (req, res, next) => {
  const { username, email, photo } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      res.cookie("access_token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite : "none",
        secure: true,
      });
      const { password: pass, ...rest } = user._doc;
      return res.status(200).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword);
      const newUser = new User({
        username:
          username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      res.cookie("access_token", token, {
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite : "none",
        secure: true,
      });
      const { password: pass, ...rest } = newUser._doc;
      return res.status(200).json(rest);
    }
  } catch (err) {
    next(err);
  }
};

const logoutController = async (req, res, next) => {
  try{
    res.clearCookie("access_token");
    return res.status(200).json("User has been logged out")
  }catch(err){
    next(err)
  }
};

module.exports = { registerController, loginController, googleController, logoutController };
