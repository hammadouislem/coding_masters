const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model file

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials. User not found.' });
    }

    // Compare password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      role: user.role
    };

    // Use a more secure secret key and ensure it's defined in the environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the JWT token
    res.status(200).json({ message: 'Sign-in successful', token });

  } catch (err) {
    // Log the error for debugging
    console.error('Sign-in error:', err);

    // Provide a more generic error message to avoid revealing sensitive information
    res.status(500).json({ error: 'Server error during sign-in. Please try again later.' });
  }
};

module.exports ={ signin};
