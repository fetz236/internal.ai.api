//src/services/authService.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid"); // Import the uuid library

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Registers a new user.
 * @async
 * @function
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} companyId - The user's company ID.
 * @returns {Object} The created user object.
 */
exports.register = async (email, password, companyId) => {
  const userId = uuidv4(); // Generate a new UUID for userId
  const user = new User(email, password, userId, companyId);
  await user.save();
  return user;
};

/**
 * Authenticates a user and generates an access token.
 * @async
 * @function
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Object} An object containing the JWT token and user data.
 * @throws {Error} If the password is invalid or user is not found.
 */
exports.login = async (email, password) => {
  const user = await User.get(email);
  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.userId }, SECRET_KEY, {
    expiresIn: "1h",
  });

  // Remove sensitive data from user object before returning
  user.password = undefined;

  return { token, user };
};
