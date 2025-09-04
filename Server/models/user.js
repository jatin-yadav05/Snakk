const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

const userModel = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 30,
        required: true
    },
    profilePicture: {
        type: String
    },
    profilePicturePublicId: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        maxLength: 300,
        default: ""
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 100,
        required: true
    },
    hostel: {
        type: String
    },
    roomNumber: {
        type: Number
    },
    phoneNumber: {
        type: String,
        maxLength: 10
    },
    branch: {
        type: String
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
    ]
    
}, { timestamps: true });

module.exports = mongoose.model("User", userModel);