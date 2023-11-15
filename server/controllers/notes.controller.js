const { default: mongoose } = require("mongoose");
const Notes = require("../models/notes.model");
const errorHandler = require("../utils/error");


const createNotesController = async (req, res, next) => {
  const { title, description, image, userId } = req.body;
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      return next(errorHandler(400, "Invalid note ID"));
    }
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You Can Only Create Your Notes"));
    }
    const notes = await Notes.create({ title, description, image, userId });
    if (!notes) {
      return next(errorHandler(500, "Failed to create notes"));
    }
    return res.status(200).json("Notes Created Successfully");
  } catch (err) {
    next(err);
  }
};

const getAllNotesController = async (req, res, next) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      return next(errorHandler(400, "Invalid note ID"));
    }
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only view your own notes"));
    }
    const notes = await Notes.find({ userId: req.params.id });
    if (!notes || notes.length === 0) {
      return res.status(404).json("No notes found");
    }
    return res.status(200).json({ notes });
  } catch (err) {
    next(err);
  }
};

const deleteNotesController = async (req, res, next) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      return next(errorHandler(400, "Invalid note ID"));
    }
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
    if (req.user.id !== note.userId) {
      return next(errorHandler(401, "You can only delete your own notes"));
    }
    await Notes.findByIdAndDelete(req.params.id);
    return res.status(200).json("Note deleted successfully");
  } catch (err) {
    next(err);
  }
};


const getNoteController = async (req, res, next) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      return next(errorHandler(400, "Invalid note ID"));
    }
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
    if (req.user.id !== note.userId) {
      return next(errorHandler(401, "You can only view your own notes"));
    }
    return res.status(200).json({ note });
  } catch (err) {
    next(err);
  }
};

const updateNotesController = async (req, res, next) => {
  const { title, description, image } = req.body;
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      return next(errorHandler(400, "Invalid note ID"));
    }
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
    if (req.user.id !== note.userId) {
      return next(errorHandler(401, "You can only update your own notes"));
    }
    const updatedNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: {
        title,
        description,
        image
      } },
      { new: true, runValidators: true }
    );
    if (!updatedNote) {
      return next(errorHandler(404, "Note not found"));
    }
    return res.status(200).json({ note: updatedNote, message: "Note updated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNotesController,
  getAllNotesController,
  deleteNotesController,
  getNoteController,
  updateNotesController,
};
