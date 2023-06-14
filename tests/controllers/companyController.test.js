// tests/controllers/companyController.test.js

const httpMocks = require("node-mocks-http");
const companyController = require("../../src/controllers/companyController");
const companyService = require("../../src/services/companyService");

jest.mock("../../src/services/companyService");

describe("Company Controller", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should register a company", async () => {
    const mockCompany = {
      name: "TestCompany",
      address: "Test Address",
      email: "testemail@test.com",
      companyId: "testCompanyId",
    };

    companyService.register.mockResolvedValue(mockCompany);

    const mockReq = httpMocks.createRequest({
      method: "POST",
      url: "/register",
      body: {
        name: "TestCompany",
        address: "Test Address",
        email: "testemail@test.com",
      },
    });

    const mockRes = httpMocks.createResponse();

    await companyController.register(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(201);
    expect(mockRes._getJSONData()).toEqual({
      message: "Company registered successfully",
      company: mockCompany,
    });
  });

  it("should retrieve company details", async () => {
    const mockCompany = {
      name: "TestCompany",
      address: "Test Address",
      email: "testemail@test.com",
      companyId: "testCompanyId",
    };

    companyService.getCompanyDetails.mockResolvedValue(mockCompany);

    const mockReq = httpMocks.createRequest({
      method: "GET",
      url: `/company/${mockCompany.companyId}`,
      params: {
        companyId: mockCompany.companyId,
      },
    });

    const mockRes = httpMocks.createResponse();

    await companyController.getCompanyDetails(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(200);
    expect(mockRes._getJSONData()).toEqual({
      message: "Company details retrieved successfully",
      company: mockCompany,
    });
  });

  it("should return 404 if company not found", async () => {
    const mockCompanyId = "nonexistentCompanyId";
    companyService.getCompanyDetails.mockResolvedValue(null);

    const mockReq = httpMocks.createRequest({
      method: "GET",
      url: `/company/${mockCompanyId}`,
      params: {
        companyId: mockCompanyId,
      },
    });

    const mockRes = httpMocks.createResponse();

    await companyController.getCompanyDetails(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(404);
    expect(mockRes._getJSONData()).toEqual({
      message: "Company not found",
    });
  });

  it("should return 400 if there is a service error", async () => {
    const mockCompanyId = "errorCompanyId";
    const mockError = new Error("Service error");

    companyService.getCompanyDetails.mockRejectedValue(mockError);

    const mockReq = httpMocks.createRequest({
      method: "GET",
      url: `/company/${mockCompanyId}`,
      params: {
        companyId: mockCompanyId,
      },
    });

    const mockRes = httpMocks.createResponse();

    await companyController.getCompanyDetails(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(400);
    expect(mockRes._getJSONData()).toEqual({
      message: "Service error",
    });
  });
});
