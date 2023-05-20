// Import required modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();
// Import your controllers or routers here
const chatbotRouter = require("./controllers/chatbotController");
const fileRouter = require("./controllers/fileController");
const userRouter = require("./controllers/userController");
const authMiddleware = require("./middleware/authMiddleware");
// Initialize the Express app
const app = express();

// Middleware configuration
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Configure routes
// Replace these with your actual routes
app.post("/register", userRouter.register);
app.post("/login", userRouter.login);
app.use("/api/file", authMiddleware, fileRouter);
app.use("/api/chatbot", authMiddleware, chatbotRouter);

// app.use('/api/users', userRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
