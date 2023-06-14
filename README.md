# internal.ai.api

API for internal ai

```
internal.ai.api
├─ .gitignore
├─ README.md
├─ jest.config.js
├─ jest.setup.js
├─ package-lock.json
├─ package.json
├─ src
│  ├─ config
│  │  └─ awsConfig.js
│  ├─ controllers
│  │  ├─ chatbotController.js
│  │  ├─ fileController.js
│  │  └─ userController.js
│  ├─ index.js
│  ├─ middleware
│  │  └─ authMiddleware.js
│  ├─ models
│  │  └─ userModel.js
│  ├─ services
│  │  ├─ userService.js
│  │  ├─ chatbotService.js
│  │  ├─ conversationHistoryService.js
│  │  └─ fileService.js
│  └─ utils
│     ├─ openaiClient.js
│     └─ passwordUtils.js
└─ tests
   ├─ controllers
   │  ├─ chatbotController.test.js
   │  └─ fileController.test.js
   ├─ dummy.docx
   ├─ dummy.txt
   ├─ middleware
   │  └─ authMiddleware.test.js
   ├─ models
   │  └─ userModel.test.js
   ├─ services
   │  ├─ userService.test.js
   │  └─ chatService.test.js
   ├─ setup.js
   └─ utils
      └─ emailHelper.js

```
