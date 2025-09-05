const express = require("express");
const router = express.Router();

// imports:
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByUser, getProductsByCategory, getProductsByHostel } = require("../controllers/product.controller");
// middlewares:
const { protectRoute } = require("../middlewares/auth.middleware");

// routes:
// Add a new product
router.post("/add-product", protectRoute, addProduct);

// get routes:
router.get("/get-all-products", protectRoute, getAllProducts);
router.get("/get-product/:id", protectRoute, getProductById);
router.get("/get-products-by-user/:userId", protectRoute, getProductsByUser);
router.get("/get-products-by-hostel", protectRoute, getProductsByHostel);
router.get("/get-products-by-category/:categoryId", protectRoute, getProductsByCategory);

// update and delete routes:
router.put("/update-product/:id", protectRoute, updateProduct);
router.delete("/delete-product/:id", protectRoute, deleteProduct);

module.exports = router;