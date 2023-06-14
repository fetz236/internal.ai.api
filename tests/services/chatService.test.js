// tests/services/chatService.test.js
const AWSMock = require("aws-sdk-mock");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { generateResponse } = require("../../src/services/chatbotService");

const mockAxios = new MockAdapter(axios);

beforeEach(() => {
  AWSMock.restore("DynamoDB.DocumentClient");
  mockAxios.reset();
});

describe("generateResponse", () => {
  beforeAll(() => {
    process.env.OPENAI_API_KEY = "mock_api_key";
  });

  test("should return the assistant's message", async () => {
    const message = "What is the capital of France?";
    const companyId = "1";
    const userEmail = "debug@example.com";
    const assistantMessage = "The capital of France is Paris.";

    mockAxios.onPost().reply(200, {
      choices: [{ message: { content: assistantMessage } }],
    });

    // Mock the DynamoDB DocumentClient methods
    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, {});
    });
    AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      callback(null, {
        Item: {
          // Mock the conversation history
          history: [{ role: "user", content: message }],
        },
      });
    });

    const response = await generateResponse(message, companyId, userEmail);
    expect(response).toBe(assistantMessage);
  });

  test("should throw an error when the API request fails", async () => {
    const message = "What is the capital of France?";
    const companyId = "1";
    const userEmail = "debug@example.com";

    mockAxios.onPost().networkError();

    await expect(
      generateResponse(message, companyId, userEmail)
    ).rejects.toMatchObject({
      message: "Network Error",
    });
  });

  test("should maintain conversation history for user and company", async () => {
    const companyId = "15251";
    const userEmail = "bugde@example.com";
    const message1 = "What is the capital of France?";
    const message2 = "What is the currency of Zimbabwe?";
    const assistantMessage1 = "The capital of France is Paris.";
    const assistantMessage2 = "The currency of Zimbabwe is the ZWD.";

    mockAxios
      .onPost()
      .replyOnce(200, {
        choices: [{ message: { content: assistantMessage1 } }],
      })
      .onPost()
      .replyOnce(200, {
        choices: [{ message: { content: assistantMessage2 } }],
      });

    // Mock the DynamoDB DocumentClient methods
    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, {});
    });
    AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      callback(null, {
        Item: {
          // Mock the conversation history
          history: [
            { role: "user", content: message1 },
            { role: "assistant", content: assistantMessage1 },
            { role: "user", content: message2 },
          ],
        },
      });
    });

    const response1 = await generateResponse(message1, companyId, userEmail);
    const response2 = await generateResponse(message2, companyId, userEmail);

    expect(response1).toBe(assistantMessage1);
    expect(response2).toBe(assistantMessage2);
    // Parse the POST data and examine the 'messages' array
    const post1Data = JSON.parse(mockAxios.history.post[0].data);
    const post2Data = JSON.parse(mockAxios.history.post[1].data);

    expect(post1Data.messages).toContainEqual({
      role: "user",
      content: message1,
    });
    expect(post1Data.messages).toContainEqual({
      role: "assistant",
      content: assistantMessage1,
    });
    expect(post2Data.messages).toContainEqual({
      role: "user",
      content: message2,
    });
    expect(post2Data.messages).toContainEqual({
      role: "assistant",
      content: assistantMessage2,
    });
  });
});
