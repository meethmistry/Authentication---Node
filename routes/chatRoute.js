const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add-chat", authMiddleware, chatController.insertChatMessage);
router.put("/update-chat/:chatId", authMiddleware, chatController.updateChatMessage);
router.delete("/delete-chat/:chatId", authMiddleware, chatController.deleteChat);
router.get("/fetch-chat/:email", authMiddleware, chatController.getChatByEmail);


module.exports = router;
