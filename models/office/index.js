const mongoose = require("../../database");

const { languages, offices } = require("../../constants");

// Create Service Schema

const serviceSchema = new mongoose.Schema({
    ar: {
        type: String,
        required: true,
    },
    en: {
        type: String,
        required: true,
    },
    de: {
        type: String,
        required: true,
    },
    tr: {
        type: String,
        required: true,
    },
}, { _id: false });

// Create Experience Schema

const experienceSchema = new mongoose.Schema({
    ar: {
        type: String,
        required: true,
    },
    en: {
        type: String,
        required: true,
    },
    de: {
        type: String,
        required: true,
    },
    tr: {
        type: String,
        required: true,
    },
}, { _id: false });

// Create Office Schema

const officeSchema = new mongoose.Schema({
    name: {
        ar: {
            type: String,
            required: true,
        },
        en: {
            type: String,
            required: true,
        },
        de: {
            type: String,
            required: true,
        },
        tr: {
            type: String,
            required: true,
        },
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
        ar: {
            type: String,
            required: true,
        },
        en: {
            type: String,
            required: true,
        },
        de: {
            type: String,
            required: true,
        },
        tr: {
            type: String,
            required: true,
        },
    },
    services: {
        type: [serviceSchema],
        required: true,
    },
    experiences: {
        type: [experienceSchema],
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: offices.DEFAULT_OFFICE_STATUS,
        enum: offices.OFFICE_STATUS,
    },
    isMainOffice: Boolean,
    language: {
        type: String,
        enum: languages.LANGUAGES,
        default: languages.DEFAULT_LANGUAGE
    },
    creatingOrderDate: {
        type: Date,
        default: Date.now,
    },
    approveDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
    blockingReason: String,
    imagePath: {
        type: String,
        required: true,
    },
});

// Create Office Model From Office Schema

const officeModel = mongoose.model("office", officeSchema);

module.exports = officeModel;