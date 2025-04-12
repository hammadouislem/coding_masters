// roleCheck.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing Token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET);

      if (!decoded.user) {
        return res.status(401).json({ error: "Unauthorized - Invalid Payload" });
      }

      const { password, ...safeUser } = decoded.user;
      req.user = safeUser;

      if (roles.length && !roles.includes(safeUser.type)) {
        return res.status(403).json({ error: "Forbidden - Insufficient Role" });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Unauthorized - Token Expired" });
      }

      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
  };
};
