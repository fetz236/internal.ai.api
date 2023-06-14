// src/models/companyModel.js

const AWS = require("../config/awsConfig"); // Use the new config file

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "Companies";

class Company {
  constructor(name, address, email, companyId) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.companyId = companyId;
  }

  async save() {
    const params = {
      TableName: tableName,
      Item: {
        name: this.name,
        address: this.address,
        email: this.email,
        companyId: this.companyId,
      },
    };

    await dynamoDB.put(params).promise();
  }

  static async get(companyId) {
    const params = {
      TableName: tableName,
      Key: {
        companyId: companyId,
      },
    };

    try {
      const data = await dynamoDB.get(params).promise();
      if (data && data.Item) {
        const { name, address, email, companyId } = data.Item;
        return new Company(name, address, email, companyId);
      } else {
        throw new Error("Company not found.");
      }
    } catch (err) {
      throw err;
    }
  }

  // Add the getByEmail method
  static async getByEmail(email) {
    const params = {
      TableName: tableName,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const data = await dynamoDB.scan(params).promise();
    if (data.Items && data.Items.length > 0) {
      const { name, address, email, companyId } = data.Items[0];
      console.log(`Company ID from database: ${companyId}`); // New log here
      return new Company(name, address, email, companyId);
    } else {
      return null;
    }
  }
}

module.exports = Company;
