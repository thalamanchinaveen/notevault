const mongoose = require("mongoose");
const User = require("./auth.model");

const notesModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", notesModelSchema);

module.exports = Notes;
