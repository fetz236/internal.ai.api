// src/services/companyService.js
const Company = require("../models/companyModel");
const { v4: uuidv4 } = require("uuid"); // Import the uuid library

/**
 * Registers a new company.
 * @async
 * @function
 * @param {string} name - The company's name.
 * @param {string} address - The company's address.
 * @param {string} email - The company's email.
 * @returns {Object} The created company object.
 * @throws {Error} If the email is invalid or a company with the provided email already exists.
 */
exports.register = async (name, address, email) => {
  // Validate the email format using regex
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Check if a company with the provided email already exists
  const existingCompany = await Company.getByEmail(email);
  if (existingCompany) {
    throw new Error("Company with the provided email already exists.");
  }

  const companyId = uuidv4(); // Generate a new UUID for companyId
  const company = new Company(name, address, email, companyId);
  await company.save();
  return company;
};

/**
 * Retrieves a company details.
 * @async
 * @function
 * @param {string} companyId - The company's ID.
 * @returns {Object} The company object.
 * @throws {Error} If the company is not found.
 */
exports.getCompanyDetails = async (companyId) => {
  const company = await Company.get(companyId);
  if (!company) {
    throw new Error("Company not found");
  }
  return company;
};
