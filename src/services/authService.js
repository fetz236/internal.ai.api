//src/services/authService.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

exports.register = async (email, password, companyId) => {
  const user = new User(email, password, undefined, companyId);
  await user.save();
  return user;
};

exports.login = async (email, password) => {
  const user = await User.get(email);
  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.userId }, SECRET_KEY, {
    expiresIn: "1h",
  });

  return { token, user };
};
