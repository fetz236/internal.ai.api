// tests/models/departmentModel.test.js
const Department = require("../../src/models/departmentModel");
const { v4: uuidv4 } = require("uuid");
const AWSMock = require("aws-sdk-mock");

describe("Department model", () => {
  const testName = "TestDepartment";
  const testAddress = "Test Address";
  const testEmail = "testdepartment@test.com";
  const testDepartmentId = uuidv4();
  const testCompanyId = "fb8d6554-1a22-4009-bf1d-23561f4ecae1";

  beforeEach(() => {
    AWSMock.restore("DynamoDB.DocumentClient");
  });

  it("should save a new department", async () => {
    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, {});
    });

    const department = new Department(
      testName,
      testAddress,
      testEmail,
      testDepartmentId,
      testCompanyId
    );

    await department.save();

    AWSMock.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      if (params.Key.departmentId === testDepartmentId) {
        callback(null, {
          Item: {
            name: testName,
            address: testAddress,
            email: testEmail,
            departmentId: testDepartmentId,
            companyId: testCompanyId,
          },
        });
      } else {
        callback(new Error("Department not found."));
      }
    });

    const savedDepartment = await Department.get(testDepartmentId);

    expect(savedDepartment.name).toBe(testName);
    expect(savedDepartment.address).toBe(testAddress);
    expect(savedDepartment.email).toBe(testEmail);
    expect(savedDepartment.departmentId).toBe(testDepartmentId);
    expect(savedDepartment.companyId).toBe(testCompanyId);
  });

  it("should get a department by email", async () => {
    AWSMock.mock("DynamoDB.DocumentClient", "query", (params, callback) => {
      if (params.ExpressionAttributeValues[":email"] === testEmail) {
        callback(null, {
          Items: [
            {
              name: testName,
              address: testAddress,
              email: testEmail,
              departmentId: testDepartmentId,
              companyId: testCompanyId,
            },
          ],
        });
      } else {
        callback(new Error("Department not found."));
      }
    });

    const savedDepartment = await Department.getByEmail(testEmail);

    expect(savedDepartment.name).toBe(testName);
    expect(savedDepartment.address).toBe(testAddress);
    expect(savedDepartment.email).toBe(testEmail);
    expect(savedDepartment.departmentId).toBe(testDepartmentId);
    expect(savedDepartment.companyId).toBe(testCompanyId);
  });
});
