// src/services/userService.test.js
const AWSMock = require("aws-sdk-mock");

const userService = require("../../src/services/userService");
const User = require("../../src/models/userModel");

const { hashPassword } = require("../../src/utils/passwordUtils");
const { randomEmail } = require("../utils/emailHelper");

beforeEach(() => {
  AWSMock.restore("DynamoDB.DocumentClient");
});

describe("userService", () => {
  describe("register", () => {
    test("should register a new user successfully", async () => {
      const email = randomEmail();
      const password = "testpassword";
      const companyId = "test-company-id";

      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {});
      });

      AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
        callback(null, {});
      });

      const newUser = await userService.register(email, password, companyId);

      expect(newUser.email).toBe(email);
      expect(newUser.password).toBe(password);
      expect(newUser.companyId).toBe(companyId);
    });

    test("should throw an error if the email already exists", async () => {
      const email = "test59373@example.com";
      const password = "testpassword";
      const companyId = "test-company-id";

      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {
          Item: {
            email,
            password,
            userId: "existing-user-id",
            companyId,
          },
        });
      });

      await expect(
        userService.register(email, password, companyId)
      ).rejects.toThrow("Email already exists.");
    });
  });

  describe("login", () => {
    test("should log in a user successfully", async () => {
      const email = "test59373@example.com";
      const password = "testpassword";
      const hashedPassword = await hashPassword(password);
      const userId = "123";
      const companyId = "456";

      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {
          Item: {
            email,
            password: hashedPassword,
            userId,
            companyId,
          },
        });
      });

      const { token, user } = await userService.login(email, password);

      expect(token).toBeTruthy();
      expect(user.email).toBe(email);
      expect(user.userId).toBe(userId);
      expect(user.companyId).toBe(companyId);
      expect(user.password).toBeUndefined();
    });

    test("should throw an error if the password is invalid", async () => {
      const email = "test59373@example.com";
      const password = "testpassword";
      const wrongPassword = "wrongpassword";
      const hashedPassword = await hashPassword(password);
      const userId = "123";
      const companyId = "456";

      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {
          Item: {
            email,
            password: hashedPassword,
            userId,
            companyId,
          },
        });
      });

      await expect(userService.login(email, wrongPassword)).rejects.toThrow(
        "Invalid password"
      );
    });
  });
});
