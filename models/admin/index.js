const mongoose = require("../../database");

// Create Admin Schema

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isWebsiteOwner: {
        type: Boolean,
        default: false,
    },
    isEngineer: {
        type: Boolean,
        default: false,
    },
    officeId: {
        type: String,
        required: true,
    },
    permissions: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                    enum: [],
                },
                value: {
                    type: Boolean,
                    required: true,
                }
            },
        ],
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockingReason: String,
    creatingDate: {
        type: Date,
        default: Date.now,
    },
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// Create Admin Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;