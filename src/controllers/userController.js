const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { email, password, companyId } = req.body;
    const user = await authService.register(email, password, companyId);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res
      .status(200)
      .json({ message: "User logged in successfully", token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
