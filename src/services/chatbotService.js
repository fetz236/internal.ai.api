const axios = require("axios");
const {
  getConversationHistory,
  saveConversationHistory,
} = require("./conversationHistoryService");
const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.OPENAI_API_KEY;

async function generateResponse(message, companyId, userEmail) {
  console.log(userEmail);
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // Get the conversation history
    const conversation = await getConversationHistory(userEmail, companyId);

    // Add the new message to the conversation
    conversation.push({ role: "user", content: message });

    // Truncate the conversation to fit within the 8k token limit
    let tokenCount = conversation.reduce(
      (count, msg) => count + msg.content.length,
      0
    );
    while (tokenCount > 8000) {
      conversation.shift();
      tokenCount = conversation.reduce(
        (count, msg) => count + msg.content.length,
        0
      );
    }

    const data = {
      model: "gpt-4",
      messages: conversation,
    };

    const response = await axios.post(openaiEndpoint, data, { headers });
    const assistantMessage = response.data.choices[0].message.content;

    // Save the updated conversation
    conversation.push({ role: "assistant", content: assistantMessage });
    await saveConversationHistory(userEmail, companyId, conversation);

    return assistantMessage;
  } catch (error) {
    console.error("Error in generateResponse:", userEmail, error);
    throw error;
  }
}

module.exports = {
  generateResponse,
};
