const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    tags: [
        {
            type: String,
            required: true
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
