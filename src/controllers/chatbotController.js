const express = require("express");
const router = express.Router();
const chatbotService = require("../services/chatbotService");

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;
    const { userEmail, companyId } = req;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    console.log(userEmail, req);
    // Process the message using your chatbotService
    const assistantMessage = await chatbotService.generateResponse(
      message,
      companyId,
      userEmail
    );

    res.json({ response: assistantMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
