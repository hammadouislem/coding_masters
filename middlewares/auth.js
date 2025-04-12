const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ error: 'User not authenticated.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid or expired.' });
    }
    req.user = decoded;  // Attach the decoded user info to the request object
    next();  // Proceed to the next middleware or route handler
  });
};

module.exports = { authenticateUser };
