const mongoose = require("../../database");

// Create Message Schema

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Create Message Model From Message Schema

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;