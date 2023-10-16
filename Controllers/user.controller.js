const { UserModel, BlacklistModel } = require("../Models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Private_Key = process.env.Private_Key;

// Controller function to register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check missing fields
    if (!username || !email || !password) {
      return res.status(404).json({ msg: "Fields Are Missing" });
    }

    // Check if a user with the same email already exists
    const isUserPresent = await UserModel.findOne({ email });

    // If a user with the same email exists, return a conflict (409) response
    if (isUserPresent) {
      return res.status(409).json({ msg: "User Already Present" });
    }

    // Hashing the user's password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Checking if password hashing was successful
    if (!hashedPassword) {
      return res.status(500).json({
        success: false,
        msg: "Error in Hashing Password",
      });
    }

    // Creating a new user with hashed password
    const registerNewUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await registerNewUser.save();

    // Return a success (201) response
    return res
      .status(201)
      .json({ msg: "Registration Succesfully", success: true });
  } catch (error) {
    // Handling any errors that occur during registration
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      msg: error.message,
    });
  }
};

// Controller function to Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check missing fields
    if (!email || !password) {
      return res.status(404).json({ msg: "Fields Are Missing" });
    }

    // Check if a user with the provided email exists
    const isUserPresent = await UserModel.findOne({ email });

    // If no user is found with the given email, return a not found (404) response
    if (!isUserPresent) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    // Comparing the provided Password with Saved Password
    bcrypt.compare(
      password,
      isUserPresent.password,
      async function (err, result) {
        if (err || !result) {
          return res
            .status(401)
            .json({ msg: "Authentication failed", success: false });
        }

        // Generating a JWT token upon successful authentication
        const token = jwt.sign(
          {
            userID: isUserPresent._id,
            email: isUserPresent.email,
          },
          Private_Key,
          {
            expiresIn: "2hr",
          }
        );

        // Return a success (200) response with the token and user information
        return res.status(200).json({
          msg: "Login Succesfully",
          User: isUserPresent,
          success: true,
          token,
        });
      }
    );
  } catch (error) {
    // Handling any errors that occur during Login
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      msg: error.message,
    });
  }
};

const LogoutUser = async (req, res) => {
  try {
    // Check for Token in Headers
    const token = req.headers?.authorization?.split(" ")[1];

    // Add Token To blacklist Model for Security
    const blacklistToken = new BlacklistModel({ token });

    // Save The Token
    await blacklistToken.save();

    // Return Success Response
    return res.status(200).json({ msg: "Logout Succesfully", success: true });
  } catch (error) {
    // Handling any errors that occur during Login
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      msg: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, LogoutUser };
