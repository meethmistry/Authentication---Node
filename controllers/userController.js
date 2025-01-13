const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendEmail = require("../services/emailService");
const otpStore = new Map();
let blacklistedTokens = [];

// First Time OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    otpStore.set(email, { otp, expiresAt: Date.now() + 2.5 * 60 * 1000 });

    const emailResponse = await SendEmail(email, otp);
    if (emailResponse.success) {
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send email.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const storedOtp = otpStore.get(email);
    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email. Please request a new one.",
      });
    }

    if (storedOtp.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (storedOtp.otp !== parseInt(otp)) {
      return res.status(422).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    otpStore.delete(email);
    return res.status(200).json({
      success: true,
      message: "OTP verified. You can now create an account.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
};

// Create User
const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      email,
      password: hashedPassword,
      dateTime: new Date(),
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user.",
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please try again.",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "GeminiPlus3",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Logout User
const logoutUser = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required for logout.",
    });
  }

  blacklistedTokens.push(token);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// Change Password After Login
const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check the email.",
      });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update password.",
      error: error.message,
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check the email entered.",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    otpStore.set(email, { otp, expiresAt: Date.now() + 2.5 * 60 * 1000 });

    const emailResponse = await SendEmail(email, otp);
    if (emailResponse.success) {
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again later.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
};

// Reset Password After Forgot Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    otpStore.delete(email);

    return res.status(200).json({
      success: true,
      message: "Password has been updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
      error: error.message,
    });
  }
};

// Delete User by Email
const deleteUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check the email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
      error: error.message,
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  createUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteUserByEmail,
  logoutUser,
};
