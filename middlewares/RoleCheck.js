const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing Token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.user) {
        return res.status(401).json({ error: "Unauthorized - Invalid Payload" });
      }

      const { password, ...safeUser } = decoded.user;
      req.user = safeUser;

      // Check if the user has a role that's permitted
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
