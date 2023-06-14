// src/controllers/fileController.js
const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const chatbotService = require("../services/chatbotService");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024,
  },
});

// Define mime types
const textMimeTypes = ["text/plain", "text/csv"];
const docxMimeType =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const isTextFileType = (mimetype) => textMimeTypes.includes(mimetype);
const isDocxFileType = (mimetype) => mimetype === docxMimeType;

const convertTextFile = (file) => file.buffer.toString("utf-8");
const convertDocxFile = async (file) => {
  const { value } = await mammoth.extractRawText({ buffer: file.buffer });
  return value;
};

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { file, userEmail, companyId } = req;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    if (!isTextFileType(file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    const fileContent = convertTextFile(file);
    const assistantMessage = await chatbotService.generateResponse(
      fileContent,
      companyId,
      userEmail
    );

    res.json({ response: assistantMessage });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/uploadDocx", upload.single("file"), async (req, res) => {
  try {
    const { file, userEmail, companyId } = req;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    if (!isDocxFileType(file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    const fileContent = (await convertDocxFile(file)).trim();
    const assistantMessage = await chatbotService.generateResponse(
      fileContent,
      companyId,
      userEmail
    );

    res.json({ response: assistantMessage });
  } catch (error) {
    handleError(res, error);
  }
});

const handleError = (res, error) => {
  console.error(error);
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({ error: "File size limit exceeded" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = router;
