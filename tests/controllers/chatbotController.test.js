// Add these lines at the beginning of your test file
jest.mock("../../src/services/chatbotService");
const { processMessage } = require("../../src/services/chatbotService");

const request = require("supertest");
const express = require("express");
const chatbotRouter = require("../../src/controllers/chatbotController");

const app = express();
app.use(express.json());
app.use("/api/chatbot", chatbotRouter);

describe("ChatbotController", () => {
  beforeEach(() => {
    processMessage.mockClear();
  });

  it("should return a response when provided with a valid message", async () => {
    processMessage.mockResolvedValue(
      "This is a mocked response from the chatbot service."
    );

    const response = await request(app)
      .post("/api/chatbot/ask")
      .send({ message: "What is the purpose of an internal wiki?" });

    console.error(response.body); // Add this line to print the error response
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("response");
  });

  it("should return an error when no message is provided", async () => {
    const response = await request(app).post("/api/chatbot/ask").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Message is required");
  });
});
