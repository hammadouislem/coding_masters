const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (roles = []) => {
  return (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing Token" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Expecting the token to have a structure like: { user: { id, type, ... } }
      if (!decoded.user || !decoded.user.type) {
        return res.status(401).json({ error: "Unauthorized - Invalid Payload" });
      }

      // Strip out sensitive fields if any (like password)
      const { password, ...safeUser } = decoded.user;
      req.user = safeUser;

      // Check if the user’s role is allowed
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
