const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../Models/user.model");
require("dotenv").config();
const Private_Key = process.env.Private_Key;

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ msg: "Token Not Provided", success: false });
    }
    const blackToken = await BlacklistModel.findOne({ token });
    if (blackToken) {
      return res
        .status(401)
        .json({ msg: "Token is Blacklisted", success: false });
    }
    // Verifying The provided token is Valid or Not
    jwt.verify(token, Private_Key, async function (err, decoded) {
      if (err) {
        return res.status(403).json({ msg: "Invalid Token", success: false });
      }
      if (decoded) {
        //Attaching UserID to req object
        req.userID = decoded.userID;
        next();
      }
    });
  } catch (error) {
    // Handling Error While Authentication
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      msg: error.message,
    });
  }
};

module.exports = { authenticate };
