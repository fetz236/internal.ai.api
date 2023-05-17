// tests/services/chatService.test.js
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { generateResponse } = require("../../src/services/chatbotService");

const mockAxios = new MockAdapter(axios);

describe("generateResponse", () => {
  beforeAll(() => {
    process.env.OPENAI_API_KEY = "mock_api_key";
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test("should return the assistant's message", async () => {
    const message = "What is the capital of France?";
    const companyId = "1";
    const userId = "1";
    const assistantMessage = "The capital of France is Paris.";

    mockAxios.onPost().reply(200, {
      choices: [{ message: { content: assistantMessage } }],
    });

    const response = await generateResponse(message, companyId, userId);
    expect(response).toBe(assistantMessage);
  });

  test("should throw an error when the API request fails", async () => {
    const message = "What is the capital of France?";
    const companyId = "1";
    const userId = "1";

    mockAxios.onPost().networkError();

    await expect(
      generateResponse(message, companyId, userId)
    ).rejects.toMatchObject({
      message: "Network Error",
    });
  });

  test("should maintain conversation history for user and company", async () => {
    const companyId = "15251";
    const userId = "15251251";
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

    const response1 = await generateResponse(message1, companyId, userId);
    const response2 = await generateResponse(message2, companyId, userId);

    expect(response1).toBe(assistantMessage1);
    expect(response2).toBe(assistantMessage2);
    // Check if the POST requests include the correct conversation history
    expect(mockAxios.history.post[0].data).toContain(
      JSON.stringify({ role: "assistant", content: assistantMessage1 })
    );
    expect(mockAxios.history.post[0].data).toContain(
      JSON.stringify({ role: "user", content: message1 })
    );
    expect(mockAxios.history.post[1].data).toContain(
      JSON.stringify({ role: "assistant", content: assistantMessage2 })
    );
    expect(mockAxios.history.post[1].data).toContain(
      JSON.stringify({ role: "user", content: message2 })
    );
  });
});
