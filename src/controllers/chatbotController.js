const express = require("express");
const router = express.Router();

// Import your chatbotService or any other required services
const chatbotService = require("../services/chatbotService");

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;
    const companyId = req.companyId;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Process the message using your chatbotService
    const response = await chatbotService.processMessage(message, companyId);

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
