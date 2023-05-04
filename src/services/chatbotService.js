const axios = require("axios");

const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;

async function generateResponse(message) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const data = {
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    };

    const response = await axios.post(openaiEndpoint, data, { headers });
    const assistantMessage = response.data.choices[0].message.content;

    return assistantMessage;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw error;
  }
}

module.exports = {
  generateResponse,
};
