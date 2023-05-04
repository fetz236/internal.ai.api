// src/middleware/authMiddleware.test.js
const httpMocks = require("node-mocks-http");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/middleware/authMiddleware");

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should return 401 if no token is provided", () => {
    authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: "No token provided" });
  });

  test("should return 401 if token format is invalid", () => {
    req.headers.authorization = "InvalidTokenFormat";
    authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: "Invalid token format" });
  });

  test("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalid_token";
    authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: "Invalid token" });
  });

  test("should call next() if token is valid", () => {
    const payload = { userId: "1234" };
    const validToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    req.headers.authorization = `Bearer ${validToken}`;
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.userId).toEqual(payload.userId);
  });
});
