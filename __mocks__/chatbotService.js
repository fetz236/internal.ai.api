const processMessage = jest.fn(async (message, companyId) => {
  // You can return a sample response or handle different test cases based on the input message.
  return "Sample response for testing purposes";
});

module.exports = {
  processMessage,
};
