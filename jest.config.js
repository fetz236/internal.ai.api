// jest.config.js
module.exports = {
  testEnvironment: "node",
  preset: "@shelf/jest-dynamodb",
  setupFiles: ["./jest.setup.js"], // Adjust the path if necessary
};
