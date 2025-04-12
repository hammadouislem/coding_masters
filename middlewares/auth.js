require('dotenv').config(); // Ensure all required env vars are defined

const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Missing or malformed token." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.user?.id || decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AuthMiddleware error:", error);

    const messages = {
      TokenExpiredError: "Token expired. Please log in again.",
      JsonWebTokenError: "Invalid token. Please try again.",
    };

    res.status(401).json({
      message: messages[error.name] || "Authentication failed.",
    });
  }
};
