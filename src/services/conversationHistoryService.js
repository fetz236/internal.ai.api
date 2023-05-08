const AWS = require("../config/awsConfig"); // Use the new config file

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "ConversationHistory";

async function getConversationHistory(userId, companyId) {
  const params = {
    TableName: tableName,
    Key: {
      userId: userId,
      companyId: companyId,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    return result.Item ? result.Item.conversation : [];
  } catch (error) {
    console.error("Error retrieving conversation history:", error);
    throw error;
  }
}

async function saveConversationHistory(userId, companyId, conversation) {
  const params = {
    TableName: tableName,
    Item: {
      userId: userId,
      companyId: companyId,
      conversation: conversation,
    },
  };

  try {
    await dynamoDb.put(params).promise();
  } catch (error) {
    console.error("Error saving conversation history:", error);
    throw error;
  }
}

module.exports = {
  getConversationHistory,
  saveConversationHistory,
};
