const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.body.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token in request body" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.type) {
        return res.status(401).json({ error: "Unauthorized - Invalid token payload" });
      }

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.type)) {
        return res.status(403).json({ error: "Forbidden - Insufficient role" });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Unauthorized - Token expired" });
      }

      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  };
};
