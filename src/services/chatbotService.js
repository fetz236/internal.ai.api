// Import required dependencies
const axios = require("axios");

// Import your OpenAI client utility or any required data models
// const openaiClient = require('../utils/openaiClient');

// Replace this with your actual OpenAI API key from process.env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function processMessage(message, companyId) {
  try {
    // Retrieve the company-specific model or data
    // const companyModel = await getCompanyModel(companyId);

    // Call the OpenAI API with the provided message and company-specific data
    const response = await axios.post(
      "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions",
      {
        prompt: message, // Add any company-specific context or data here
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim();
    } else {
      throw new Error("No response from the OpenAI API");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error processing message");
  }
}

// Export your service functions
module.exports = {
  processMessage,
};
