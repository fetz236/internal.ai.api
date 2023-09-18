const AWS = require("../config/awsConfig");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "Departments";

class Department {
  constructor(name, address, email, departmentId, companyId) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.departmentId = departmentId;
    this.companyId = companyId;
  }

  async save() {
    const params = {
      TableName: tableName,
      Item: {
        departmentId: this.departmentId,
        name: this.name,
        address: this.address,
        email: this.email,
        companyId: this.companyId,
      },
    };

    await dynamoDB.put(params).promise();
  }

  static async get(departmentId) {
    const params = {
      TableName: tableName,
      Key: {
        departmentId: departmentId,
      },
    };

    try {
      const data = await dynamoDB.get(params).promise();
      if (data && data.Item) {
        const { name, address, email, departmentId, companyId } = data.Item;
        return new Department(name, address, email, departmentId, companyId);
      } else {
        throw new Error("Department not found.");
      }
    } catch (err) {
      throw err;
    }
  }

  static async getByEmail(email) {
    const params = {
      TableName: tableName,
      IndexName: "EmailIndex", // The name of your GSI
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const data = await dynamoDB.query(params).promise();
    if (data.Items && data.Items.length > 0) {
      const { name, address, email, departmentId, companyId } = data.Items[0];
      return new Department(name, address, email, departmentId, companyId);
    } else {
      return null;
    }
  }
}

module.exports = Department;
