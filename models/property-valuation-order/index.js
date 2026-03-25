const mongoose = require("../../database");

const { OWNERS, DEFAULT_OWNER } = require("../../constants/property-valuation");

// Create Property Valuation Order Schema

const propertyValuationSchema = new mongoose.Schema({
    owner: {
        type: String,
        enum: OWNERS,
        default: DEFAULT_OWNER,
    },
    fullName: {
        type: String,
        required: true,
    },
    representativeFullName: {
        type: String,
        required: function () {
            return this.owner === "representative";
        },
    },
    legalEntity: {
        type: String,
        required: function () {
            return this.owner === "representative";
        },
    },
    city: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    whatsappNumber: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Create Property Valuation Order Model From Property Valuation Order Schema

const propertyValuationModel = mongoose.model("property_valuation_order", propertyValuationSchema);

module.exports = propertyValuationModel;