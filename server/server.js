const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const dbConnection = require('./config/dbConnection');
const authRouter = require('./routes/auth.routes.js');
const userRouter = require('./routes/user.routes.js');
const notesRouter = require('./routes/notes.routes.js');
const errorHandler = require('./utils/error.js');

dotenv.config();

const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);

app.use((req, res, next) => {
  const error = errorHandler(404, "API Not Found");
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});

const startServer = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`SERVER IS LISTENING ON ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
  }
};

startServer();
