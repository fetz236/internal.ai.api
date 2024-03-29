const request = require("supertest");
const express = require("express");
const chatbotRouter = require("../../src/controllers/chatbotController");
const userService = require("../../src/services/userService");
const authMiddleware = require("../../src/middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use("/api/chatbot", authMiddleware, chatbotRouter);

describe("ChatbotController", () => {
  let token; // hold the token

  beforeAll(async () => {
    // add login process before all tests
    const authResponse = await userService.login(
      "debug@example.com",
      "testpassword"
    );
    token = authResponse.token;
  });

  it("should return a response when provided with a valid message", async () => {
    const response = await request(app)
      .post("/api/chatbot/ask")
      .set("Authorization", `Bearer ${token}`) // add token to request header
      .send({ message: "hi" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("response");
  });

  it("should return an error when no message is provided", async () => {
    const response = await request(app)
      .post("/api/chatbot/ask")
      .set("Authorization", `Bearer ${token}`) // add token to request header
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Message is required");
  });
});
