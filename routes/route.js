const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// Route to send OTP to user's email
router.post("/send-otp", userController.sendOtp);

// Route to verify OTP
router.post("/verify-otp", userController.verifyOtp);

// Route to sign up (create user)
router.post("/signup", userController.createUser);

// Route to log in the user
router.post("/login", userController.loginUser);

// Route to log out the user
router.post("/logout", userController.logoutUser);

// Route to change password
router.post("/change-password", userController.changePassword);

// Route to forgot password
router.post("/forgot-password", userController.forgotPassword);

// Route to reset password
router.post("/reset-password", userController.resetPassword);

// Route to delete account
router.post("/delete-account", userController.deleteUserByEmail);

module.exports = router;
