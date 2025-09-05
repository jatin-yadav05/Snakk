const express = require("express");
const router = express.Router();

const { createCategory, getAllCategories } = require("../controllers/category.controller");

// routes:
// Create a new category
router.post("/create", createCategory);

// Get all categories
router.get("/get-all", getAllCategories);

module.exports = router;