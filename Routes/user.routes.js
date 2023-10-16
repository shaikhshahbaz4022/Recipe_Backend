const express = require("express");
const {
  registerUser,
  loginUser,
  LogoutUser,
} = require("../Controllers/user.controller");

// Creating an instance of an Express Router
const userRouter = express.Router();

// Handling the HTTP POST request for user registration
userRouter.post("/register", registerUser);

// Handling the HTTP POST request for user login
userRouter.post("/login", loginUser);

// Handling the HTTP POST request for user Logout
userRouter.post("/logout", LogoutUser);

// Exporting the userRouter
module.exports = { userRouter };
