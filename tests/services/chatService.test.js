// tests/generateResponse.test.js
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
    const assistantMessage = "The capital of France is Paris.";

    mockAxios.onPost().reply(200, {
      choices: [{ message: { content: assistantMessage } }],
    });

    const response = await generateResponse(message);
    expect(response).toBe(assistantMessage);
  });

  test("should throw an error when the API request fails", async () => {
    const message = "What is the capital of France?";

    mockAxios.onPost().networkError();

    await expect(generateResponse(message)).rejects.toMatchObject({
      message: "Network Error",
    });
  });
});
