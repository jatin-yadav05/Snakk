const express = require("express");
const router = express.Router();

// imports:
const { signup, login } = require("../controllers/user.controller");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
