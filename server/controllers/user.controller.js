const bcryptjs = require("bcryptjs");

const errorHandler = require("../utils/error.js");
const User = require("../models/auth.model.js");
const Notes = require("../models/notes.model.js");

const updateUserController = async (req, res, next) => {
  try {
    console.log(req.params.id);
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You Can Only Update Your Account"));
    }
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    const { password: pass, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You Can Only Delete Your Account"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    return res.status(200).json("User has been Deleted Successfully!");
  } catch (err) {
    next(err);
  }
};

const getUserDetailsController = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You Can Only Get Your Account Details"));
    }
    const userDetails = await User.findOne({ _id: req.params.id });
    if (userDetails === null) {
      return next(errorHandler(404, "User Not Found"));
    }
    const { password, ...rest } = userDetails._doc;
    return res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};


module.exports = {
  updateUserController,
  deleteUserController,
  getUserDetailsController,
};
