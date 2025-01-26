const mongoose = require("mongoose");

const ChatModel = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        ref: "users",
    },
    chats: [
        {
            role: {
                type: String,
                enum: ["user", "assistant"],
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Chat = mongoose.model("chats", ChatModel);

module.exports = Chat;
