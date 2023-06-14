// tests/fileController.test.js
const request = require("supertest");
const express = require("express");
const fileController = require("../../src/controllers/fileController");
const chatbotService = require("../../src/services/chatbotService");
const authMiddleware = require("../../src/middleware/authMiddleware");
const userService = require("../../src/services/userService");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use("/api/file", authMiddleware, fileController);

// Mock the chatbotService.generateResponse() function
jest.mock("../../src/services/chatbotService", () => {
  return {
    generateResponse: jest.fn(),
  };
});

let token;

describe("POST /api/file/upload", () => {
  beforeEach(() => {
    chatbotService.generateResponse.mockReset();
  });
  beforeAll(async () => {
    // add login process before all tests
    const authResponse = await userService.login(
      "debug@example.com",
      "testpassword"
    );
    token = authResponse.token;
  });

  test("should return 400 if no file is uploaded", async () => {
    const response = await request(app)
      .post("/api/file/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("Invalid file content"), {
        filename: "test.invalid",
        contentType: "application/octet-stream",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid file type" });
  });

  test("should return 400 if an invalid file type is uploaded", async () => {
    const response = await request(app)
      .post("/api/file/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("Invalid file content"), {
        filename: "test.invalid",
        contentType: "application/octet-stream",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid file type" });
  });

  test("should return the assistant's response when a valid file is uploaded", async () => {
    chatbotService.generateResponse.mockResolvedValue("Processed file content");

    const response = await request(app)
      .post("/api/file/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("Valid file content"), {
        filename: "test.txt",
        contentType: "text/plain",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ response: "Processed file content" });
    expect(chatbotService.generateResponse).toHaveBeenCalledWith(
      "Valid file content",
      "123",
      "debug@example.com"
    );
  });

  test("should return 500 if an error occurs while processing the file", async () => {
    chatbotService.generateResponse.mockRejectedValue(new Error("Test error"));

    const response = await request(app)
      .post("/api/file/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("Valid file content"), {
        filename: "test.txt",
        contentType: "text/plain",
      });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });

  test("should return the assistant's response when a valid file is uploaded", async () => {
    chatbotService.generateResponse.mockResolvedValue("Processed file content");

    const filePath = path.resolve(__dirname, "../dummy.txt");

    const response = await request(app)
      .post("/api/file/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ response: "Processed file content" });
    expect(chatbotService.generateResponse).toHaveBeenCalledWith(
      fs.readFileSync(filePath, "utf-8"),
      "123",
      "debug@example.com"
    );
  });
});

describe("POST /api/file/uploadDocx", () => {
  beforeEach(() => {
    chatbotService.generateResponse.mockReset();
  });
  beforeAll(async () => {
    // add login process before all tests
    const authResponse = await userService.login(
      "debug@example.com",
      "testpassword"
    );
    token = authResponse.token;
  });
  test("should return 400 if no file is uploaded", async () => {
    const response = await request(app)
      .post("/api/file/uploadDocx")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("Invalid file content"), {
        filename: "test.invalid",
        contentType: "application/octet-stream",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid file type" });
  });

  test("should return 400 if an invalid file type is uploaded", async () => {
    const response = await request(app)
      .post("/api/file/uploadDocx")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("Invalid file content"), {
        filename: "test.invalid",
        contentType: "application/octet-stream",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid file type" });
  });

  test("should return the assistant's response when a valid .docx file is uploaded", async () => {
    chatbotService.generateResponse.mockResolvedValue(
      "Processed .docx file content"
    );

    const filePath = path.resolve(__dirname, "../dummy.docx");

    const response = await request(app)
      .post("/api/file/uploadDocx")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", filePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ response: "Processed .docx file content" });
    // The exact content here depends on what's in the dummy.docx file and how mammoth.js processes it
    expect(chatbotService.generateResponse).toHaveBeenCalledWith(
      "Please respond only with docx",
      "123",
      "debug@example.com"
    );
  });

  test("should return 500 if an error occurs while processing the .docx file", async () => {
    chatbotService.generateResponse.mockRejectedValue(new Error("Test error"));

    const filePath = path.resolve(__dirname, "../dummy.docx");

    const response = await request(app)
      .post("/api/file/uploadDocx")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", filePath);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});
