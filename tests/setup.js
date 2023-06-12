// src/models/userModel.js

const AWS = require("aws-sdk"),
      {
        DynamoDBDocument
      } = require("@aws-sdk/lib-dynamodb"),
      {
        DynamoDB
      } = require("@aws-sdk/client-dynamodb");
const bcrypt = require("bcrypt");

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION, // Replace with your AWS region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = DynamoDBDocument.from(new DynamoDB());

class User {
  constructor(userData) {
    this.email = userData.email;
    this.password = userData.password;
    this.userId = userData.userId;
    this.companyId = userData.companyId;
  }

  async save() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    const params = {
      TableName: "Users",
      Item: {
        email: this.email,
        password: this.password,
        userId: this.userId,
        companyId: this.companyId,
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.put(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static async get(email) {
    const params = {
      TableName: "Users",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.query(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Items[0]);
        }
      });
    });
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

module.exports = User;
