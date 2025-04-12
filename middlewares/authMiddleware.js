const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided or invalid format." });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token found." });
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findByPk(decoded.id, { attributes: { exclude: ["password"] } });

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }

    res.status(401).json({ message: "Authentication failed." });
  }
};
