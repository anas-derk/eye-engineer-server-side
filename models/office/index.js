const mongoose = require("../../database");

const officeConstants = require("../../constants/offices");

// Create Office Schema

const officeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerFullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: officeConstants.DEFAULT_OFFICE_STATUS,
        enum: officeConstants.OFFICE_STATUS,
    },
    isMainOffice: Boolean,
    creatingOrderDate: {
        type: Date,
        default: Date.now,
    },
    approveDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
    blockingReason: String,
});

// Create Office Model From Office Schema

const officeModel = mongoose.model("office", officeSchema);

module.exports = officeModel;