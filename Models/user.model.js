const mongoose = require("mongoose");

// Defining the user schema
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    savedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipe",
      },
    ],
  },
  { timestamps: true }
);

// Creating a User model from the user schema
const UserModel = mongoose.model("user", userSchema);

// Defining Blacklist Schema
const blacklistSchema = mongoose.Schema({
  token: { type: String },
});

// Creating Blacklist Model Constructor
const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

// Exporting the User model and Blacklist model for use in other modules
module.exports = { UserModel, BlacklistModel };
