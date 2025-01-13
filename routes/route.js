const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware"); // Middleware for token validation
const router = express.Router();

// Public Routes
router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp); 
router.post("/signup", userController.createUser); 
router.post("/login", userController.loginUser); 
router.post("/forgot-password", userController.forgotPassword); 
router.post("/reset-password", userController.resetPassword); 

// Protected Routes (Require token validation)
router.post("/logout", authMiddleware, userController.logoutUser); 
router.post("/change-password", authMiddleware, userController.changePassword);
router.delete("/delete-account", authMiddleware, userController.deleteUserByEmail); 

module.exports = router;
