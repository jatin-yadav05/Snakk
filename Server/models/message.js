const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
    },
    image: {
        type: String,
        required: false
    },
    isSeen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
