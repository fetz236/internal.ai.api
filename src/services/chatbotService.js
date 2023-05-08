const axios = require("axios");

const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;

const conversationHistory = {};

async function generateResponse(message, companyId, userId) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // Initialize conversation history for the company and user if it doesn't exist
    if (!conversationHistory[companyId]) {
      conversationHistory[companyId] = {};
    }
    if (!conversationHistory[companyId][userId]) {
      conversationHistory[companyId][userId] = [
        { role: "system", content: `Company ID: ${companyId}` },
      ];
    }

    // Add the new user message to the conversation history
    conversationHistory[companyId][userId].push({
      role: "user",
      content: message,
    });

    const data = {
      model: "gpt-4",
      messages: conversationHistory[companyId][userId],
    };

    const response = await axios.post(openaiEndpoint, data, { headers });
    const assistantMessage = response.data.choices[0].message.content;

    // Add the assistant message to the conversation history
    conversationHistory[companyId][userId].push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw error;
  }
}

module.exports = {
  generateResponse,
};
