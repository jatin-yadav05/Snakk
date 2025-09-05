const express = require("express");
const router = express.Router();

// imports:
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByUser, getProductsByCategory, getProductsByHostel } = require("../controllers/product.controller");
// middlewares:
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/create-product", protectRoute, createProduct);
router.get("/get-all-products", protectRoute, getAllProducts);
router.get("/get-product/:id", protectRoute, getProductById);
router.put("/update-product/:id", protectRoute, updateProduct);
router.delete("/delete-product/:id", protectRoute, deleteProduct);
router.get("/get-products-by-user/:userId", protectRoute, getProductsByUser);
router.get("/get-products-by-hostel/:hostelId", protectRoute, getProductsByHostel);
router.get("/get-products-by-category/:categoryId", protectRoute, getProductsByCategory);

module.exports = router;
