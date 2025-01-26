const ChatModel = require("../models/chatModel");

// Insert Chat Message
const insertChatMessage = async (req, res) => {
  const { email, message, role } = req.body;

  try {
    if (!email || !message || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields (email, message, role) are required.",
      });
    }

      chat = new ChatModel({
        email,
        chats: [{ role, message }],
      });
   

    // Save chat to the database
    await chat.save();

    return res.status(201).json({
      success: true,
      message: "Chat message inserted successfully.",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to insert chat message.",
      error: error.message,
    });
  }
};

// Update Chat Message by ID
const updateChatMessage = async (req, res) => {
  const { chatId } = req.params; // Get chat document ID from URL params
  const { role, message } = req.body; // New chat message data

  try {
    if (!role || !message) {
      return res.status(400).json({
        success: false,
        message: "Both role and message are required.",
      });
    }

    // Find chat by ID and update the chats array
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $push: { chats: { role, message } } }, // Add new chat to chats array
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: "Chat document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat message updated successfully.",
      data: updatedChat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update chat message.",
      error: error.message,
    });
  }
};

// Delete Chat by ID (Delete entire chat document)
const deleteChat = async (req, res) => {
    const { chatId } = req.params; // Get chat document ID from URL params
  
    try {
      const deletedChat = await ChatModel.findByIdAndDelete(chatId);
  
      if (!deletedChat) {
        return res.status(404).json({
          success: false,
          message: "Chat document not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Chat document deleted successfully.",
        data: deletedChat,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete chat document.",
        error: error.message,
      });
    }
  };
  

  // Get Chat by Email
const getChatByEmail = async (req, res) => {
    const { email } = req.params; // Get email from URL params
  
    try {
      // Find the chat document by email
      const chat = await ChatModel.find({ email });
  
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat document not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Chat document retrieved successfully.",
        data: chat,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve chat document.",
        error: error.message,
      });
    }
  };
  

module.exports = {
  insertChatMessage,
  updateChatMessage,
  deleteChat,
  getChatByEmail
};
