const express = require("express");
const {
  createNotesController,
  getAllNotesController,
  deleteNotesController,
  getNoteController,
  updateNotesController
} = require("../controllers/notes.controller");
const verifyToken = require("../utils/verifyUser");

const notesRouter = express.Router();

notesRouter.post("/createnotes/:id", verifyToken, createNotesController);
notesRouter.get("/getallnotes/:id", verifyToken, getAllNotesController);
notesRouter.delete("/delete/:id", verifyToken, deleteNotesController);
notesRouter.get("/getnote/:id", verifyToken, getNoteController);
notesRouter.post("/updatenote/:id", verifyToken, updateNotesController);


module.exports = notesRouter;