const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const { MONGO_URI } = process.env;

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('DB IS CONNECTED');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
};

module.exports = dbConnection;
