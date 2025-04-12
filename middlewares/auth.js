const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token; // optionally support query param too

  if (!token) {
    return res.status(401).json({ error: 'Token is required in request body or query' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
