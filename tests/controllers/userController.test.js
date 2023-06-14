// tests/controllers/userController.test.js
const userController = require("../../src/controllers/userController");
const userService = require("../../src/services/userService");

const httpMocks = require("node-mocks-http");

jest.mock("../../src/services/userService");

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      const req = httpMocks.createRequest({
        body: {
          email: "test@example.com",
          password: "testpassword",
          companyId: "testcompanyid",
        },
      });

      const res = httpMocks.createResponse();

      const userStub = {
        email: "test@example.com",
        companyId: "testcompanyid",
      };
      userService.register.mockResolvedValue(userStub);

      await userController.register(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        message: "User registered successfully",
        user: userStub,
      });
    });

    it("should return an error when registration fails", async () => {
      const req = httpMocks.createRequest({
        body: {
          email: "test@example.com",
          password: "testpassword",
          companyId: "testcompanyid",
        },
      });

      const res = httpMocks.createResponse();

      userService.register.mockRejectedValue(new Error("Registration failed"));

      await userController.register(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Registration failed" });
    });
  });

  describe("login", () => {
    it("should log in a user successfully", async () => {
      const req = httpMocks.createRequest({
        body: {
          email: "test@example.com",
          password: "testpassword",
        },
      });

      const res = httpMocks.createResponse();

      const loginStub = {
        token: "sometoken",
        user: { email: "test@example.com" },
      };
      userService.login.mockResolvedValue(loginStub);

      await userController.login(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: "User logged in successfully",
        token: loginStub.token,
        user: loginStub.user,
      });
    });

    it("should return an error when login fails", async () => {
      const req = httpMocks.createRequest({
        body: {
          email: "test@example.com",
          password: "testpassword",
        },
      });

      const res = httpMocks.createResponse();

      userService.login.mockRejectedValue(new Error("Login failed"));

      await userController.login(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Login failed" });
    });
  });
});
