const express = require("express");
const { protectRoute } = require("../middleware/auth.middleware");

// Controllers
const { fetchChats, getChatById, sendMessage } = require("../controllers/chat.controller");

const router = express.Router();

router.get("/", protectRoute, fetchChats);
router.get("/:id", protectRoute, getChatById);
router.post("/:id/messages", protectRoute, sendMessage);


module.exports = router;