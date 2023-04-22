const request = require("supertest");
const express = require("express");
const chatbotRouter = require("../../src/controllers/chatbotController");

const app = express();
app.use(express.json());
app.use("/api/chatbot", chatbotRouter);

describe("ChatbotController", () => {
  it("should return a response when provided with a valid message", async () => {
    const response = await request(app)
      .post("/api/chatbot/ask")
      .send({ message: "hi" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("response");
  }, 10000); // Increase the timeout to 10 seconds

  it("should return an error when no message is provided", async () => {
    const response = await request(app).post("/api/chatbot/ask").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Message is required");
  });
});
