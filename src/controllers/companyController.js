// src/controllers/companyController.js
const companyService = require("../services/companyService");

/**
 * Handles company registration requests.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.register = async (req, res) => {
  try {
    const { name, address, email } = req.body;
    const company = await companyService.register(name, address, email);
    res
      .status(201)
      .json({ message: "Company registered successfully", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles requests to retrieve company details.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getCompanyDetails = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await companyService.getCompanyDetails(companyId);
    if (company) {
      res
        .status(200)
        .json({ message: "Company details retrieved successfully", company });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
