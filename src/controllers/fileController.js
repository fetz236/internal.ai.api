const express = require("express");
const multer = require("multer");
const chatbotService = require("../services/chatbotService");

const router = express.Router();

// Configure multer for in-memory storage and file size limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024, // 1 MB file size limit
  },
});

// Define the valid mime types for the accepted file formats
const validMimeTypes = ["text/plain", "text/csv"];

/**
 * Check if the mimetype of the file is valid.
 *
 * @param {string} mimetype - The mimetype of the file to be checked.
 * @return {boolean} - Returns true if the mimetype is valid, false otherwise.
 */
const isValidFileType = (mimetype) => {
  return validMimeTypes.includes(mimetype);
};

/**
 * POST /upload route for uploading a file and processing its content.
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { file, userEmail, companyId } = req;
    console.log(file, userEmail, companyId);
    // Check if a file is provided
    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    // Validate the file type
    if (!isValidFileType(file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Convert the file buffer to a string
    const fileContent = file.buffer.toString("utf-8");

    // Process the file content using your chatbotService
    const assistantMessage = await chatbotService.generateResponse(
      fileContent,
      companyId,
      userEmail
    );

    // Send the assistant's response as JSON
    res.json({ response: assistantMessage });
  } catch (error) {
    console.error(error);
    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      // Handle file size limit error
      res.status(400).json({ error: "File size limit exceeded" });
    } else {
      // Handle other internal server errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = router;
