const mongoose = require("../../database");

// Create User Schema

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    provider: {
        type: String,
        default: "same-site",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: "",
    },
    language: {
        type: String,
        enum: [
            "ar",
            "en",
            "de",
            "tr"
        ],
        default: "en"
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
    imagePath: {
        type: String,
        default: "assets/images/defaultProfileImage.png"
    },
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;