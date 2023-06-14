// tests/models/companyModel.test.js
const Company = require("../../src/models/companyModel");
const { v4: uuidv4 } = require("uuid");
const AWSMock = require("aws-sdk-mock");

describe("Company model", () => {
  const testName = "TestCompany";
  const testAddress = "Test Address";
  const testEmail = "testemail@test.com";
  const testCompanyId = "fb8d6554-1a22-4009-bf1d-23561f4ecae1";

  beforeEach(() => {
    AWSMock.restore("DynamoDB.DocumentClient");
  });

  it("should save a new company", async () => {
    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, {});
    });

    const company = new Company(
      testName,
      testAddress,
      testEmail,
      testCompanyId
    );

    await company.save();

    AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      if (params.Key.companyId === testCompanyId) {
        callback(null, {
          Item: {
            name: testName,
            address: testAddress,
            email: testEmail,
            companyId: testCompanyId,
          },
        });
      } else {
        callback(new Error("Company not found."));
      }
    });

    const savedCompany = await Company.get(testCompanyId);

    expect(savedCompany.name).toBe(testName);
    expect(savedCompany.address).toBe(testAddress);
    expect(savedCompany.email).toBe(testEmail);
    expect(savedCompany.companyId).toBe(testCompanyId);
  });

  it("should get a company by email", async () => {
    AWSMock.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      if (params.ExpressionAttributeValues[":email"] === testEmail) {
        callback(null, {
          Items: [
            {
              name: testName,
              address: testAddress,
              email: testEmail,
              companyId: testCompanyId, // Ensure this matches the testCompanyId
            },
          ],
        });
      } else {
        callback(new Error("Company not found."));
      }
    });

    const savedCompany = await Company.getByEmail(testEmail);

    expect(savedCompany.name).toBe(testName);
    expect(savedCompany.address).toBe(testAddress);
    expect(savedCompany.email).toBe(testEmail);
    expect(savedCompany.companyId).toBe(testCompanyId);
  });
});
