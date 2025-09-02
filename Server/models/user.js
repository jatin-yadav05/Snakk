const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 100,
        required: true
    },
    hostel: {
        type: String,
        required: true
    },
    roomNumber: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        maxLength: 10,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        }
    ],
    OTP: {
        type: String,
        required: true,
        maxLength: 6,
        minLength: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true })

module.exports = mongoose.model("User", userModel);