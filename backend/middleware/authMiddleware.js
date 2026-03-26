const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token in cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      return next(new Error('User not found'));
    }

    next();
  } catch (err) {
    res.status(401);
    return next(new Error('Not authorized to access this route'));
  }
};

module.exports = { protect };
