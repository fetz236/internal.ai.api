// Import required modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();
console.log(process.env);
// Import your controllers or routers here
const chatbotRouter = require("./controllers/chatbotController");
// const userRouter = require('./controllers/userController');

// Initialize the Express app
const app = express();

// Middleware configuration
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Configure routes
// Replace these with your actual routes
app.use("/api/chatbot", chatbotRouter);
// app.use('/api/users', userRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
