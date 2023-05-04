# internal.ai.api

API for internal ai

```
internal.ai.api
├─ README.md
├─ jest-dynamodb-config.js
├─ jest.config.js
├─ jest.setup.js
├─ package-lock.json
├─ package.json
├─ src
│  ├─ config
│  │  └─ awsConfig.js
│  ├─ controllers
│  │  ├─ chatbotController.js
│  │  └─ userController.js
│  ├─ index.js
│  ├─ langchain
│  │  ├─ langchainClient.js
│  │  └─ langchainService.js
│  ├─ middleware
│  │  └─ authMiddleware.js
│  ├─ models
│  │  └─ userModel.js
│  ├─ services
│  │  ├─ authService.js
│  │  ├─ chatbotService.js
│  │  └─ userService.js
│  └─ utils
│     ├─ openaiClient.js
│     └─ passwordUtils.js
└─ tests
   ├─ controllers
   │  └─ chatbotController.test.js
   ├─ langchain
   ├─ middleware
   ├─ models
   │  └─ userModel.test.js
   ├─ services
   └─ setup.js

```
