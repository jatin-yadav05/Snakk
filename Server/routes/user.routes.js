const express = require("express");
const router = express.Router();

// imports:
const { signup, login, auth, sendOTP, verifyOTP, forgotPassword, resetPassword, changePassword } = require("../controllers/auth.controller");
const { getProfile, updateProfile, deleteProfile, updateProfilePicture } = require("../controllers/profile.controller");

// middlewares:
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/auth", protectRoute, auth);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// passwords:
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

// profile routes:
router.get("/profile/:id", protectRoute, getProfile);
router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-profile-picture", protectRoute, updateProfilePicture);
router.delete("/delete-profile", protectRoute, deleteProfile);


module.exports = router;
