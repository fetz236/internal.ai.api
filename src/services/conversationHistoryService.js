const AWS = require("../config/awsConfig"); // Use the new config file

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "ConversationHistory";

async function getConversationHistory(userEmail, companyId) {
  const params = {
    TableName: tableName,
    Key: {
      email: userEmail,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return result.Item.conversation;
    } else {
      // If there is no existing conversation history, create a new record
      await saveConversationHistory(userEmail, companyId, []);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving or creating conversation history:", error);
    throw error;
  }
}

async function saveConversationHistory(userEmail, companyId, conversation) {
  const params = {
    TableName: tableName,
    Item: {
      email: userEmail,
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
