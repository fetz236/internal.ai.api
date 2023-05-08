// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Load the JWT secret from the environment variable or use a default value
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Middleware function to authenticate the user using JWT token.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next function to call the next middleware.
 */
const authMiddleware = (req, res, next) => {
  // Get the 'authorization' header from the request
  const authHeader = req.headers.authorization;

  // If the 'authorization' header is missing, return a 401 status with an error message
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Split the 'authorization' header value into scheme and token
  const [scheme, token] = authHeader.split(" ");

  // Check if the scheme is 'Bearer' and the token is present, otherwise return a 401 status with an error message
  if (!token || scheme !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  // Try to verify the JWT token and set the decoded userId in the request object
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // If token verification fails, return a 401 status with an error message
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Export the authMiddleware function
module.exports = authMiddleware;
