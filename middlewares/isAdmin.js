const isAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  if (!req.user.is_approved) {
    return res.status(403).json({ message: "Admin approval pending. Contact another admin." });
  }

  next();
};

module.exports = { isAdmin };
