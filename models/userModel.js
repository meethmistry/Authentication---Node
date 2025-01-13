const mongoose = require("mongoose");

const UserModel = new  mongoose.Schema({
    email:{
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        trim: true,
        required: true,
    },
    dateTime:{
        type:Date,
        default: Date.now,
    }
});

const user = mongoose.model("users", UserModel);

module.exports = user;
