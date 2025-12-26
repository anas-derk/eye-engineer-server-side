const mongoose = require("../../database");

const { languages, users } = require("../../constants");

// Create User Schema

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    provider: {
        type: String,
        enum: users.USER_PROVIDERS,
        default: users.DEFAULT_USER_PROVIDER,
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
        enum: languages.LANGUAGES,
        default: languages.DEFAULT_LANGUAGE
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