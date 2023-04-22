// src/models/userModel.js

const AWS = require("../config/awsConfig"); // Use the new config file
const { hashPassword, comparePassword } = require("../utils/passwordUtils");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "Users";

class User {
  constructor(email, password, userId, companyId) {
    this.email = email;
    this.password = password;
    this.userId = userId;
    this.companyId = companyId;
  }

  async save() {
    // Check if the email already exists
    try {
      const existingUser = await User.get(this.email);
      if (existingUser) {
        throw new Error("Email already exists.");
      }
    } catch (err) {
      if (err.message !== "User not found.") {
        throw err;
      }
    }

    const hashedPassword = await hashPassword(this.password);

    const params = {
      TableName: tableName,
      Item: {
        email: this.email,
        password: hashedPassword,
        userId: this.userId,
        companyId: this.companyId,
      },
    };

    await dynamoDB.put(params).promise();
  }

  static async get(email) {
    const params = {
      TableName: tableName,
      Key: {
        email: email,
      },
    };

    return new Promise((resolve, reject) => {
      dynamoDB.get(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (data && data.Item) {
            const { email, password, userId, companyId } = data.Item;
            resolve(new User(email, password, userId, companyId));
          } else {
            reject(new Error("User not found."));
          }
        }
      });
    });
  }

  async validatePassword(password) {
    return await comparePassword(password, this.password);
  }
}

module.exports = User;
