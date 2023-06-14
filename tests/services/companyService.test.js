// src/services/companyService.test.js
const AWSMock = require("aws-sdk-mock");

const companyService = require("../../src/services/companyService");

const { randomEmail } = require("../utils/emailHelper");

beforeEach(() => {
  AWSMock.restore("DynamoDB.DocumentClient");
});

describe("companyService", () => {
  describe("register", () => {
    test("should register a new company successfully", async () => {
      const name = "TestCompany";
      const address = "Test Address";
      const email = randomEmail();

      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {});
      });

      AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
        callback(null, {});
      });

      const newCompany = await companyService.register(name, address, email);

      expect(newCompany.name).toBe(name);
      expect(newCompany.address).toBe(address);
      expect(newCompany.email).toBe(email);
    });

    test("should throw an error if the email already exists", async () => {
      const name = "TestCompany";
      const address = "Test Address";
      const email = "test59373@example.com";

      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {
          Item: {
            name,
            address,
            email,
            companyId: "existing-company-id",
          },
        });
      });

      AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
        callback(null, {});
      });

      await expect(
        companyService.register(name, address, email)
      ).rejects.toThrow("Company with the provided email already exists.");
    });
  });

  describe("getCompanyDetails", () => {
    test("should get company details successfully", async () => {
      const name = "TestCompany";
      const address = "Test Address";
      const email = randomEmail();

      // Mock the put method to mimic the behavior of creating a company
      AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
        callback(null, {});
      });

      // Mock the get method to return no existing company
      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {});
      });

      // Call the register function to create the company
      const newCompany = await companyService.register(name, address, email);

      // Mock the get method to mimic the behavior of getting a company from DynamoDB
      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {
          Item: {
            name,
            address,
            email,
            companyId: newCompany.companyId,
          },
        });
      });

      // Call the getCompanyDetails function to get the company's details
      const company = await companyService.getCompanyDetails(
        newCompany.companyId
      );

      expect(company.name).toBe(name);
      expect(company.address).toBe(address);
      expect(company.email).toBe(email);
      expect(company.companyId).toBe(newCompany.companyId);
    });

    test("should throw an error if the company is not found", async () => {
      const companyId = "123";

      AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
        callback(null, {});
      });

      await expect(companyService.getCompanyDetails(companyId)).rejects.toThrow(
        "Company not found"
      );
    });
  });
});
