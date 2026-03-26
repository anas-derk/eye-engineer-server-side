const mongoose = require("../../database");

const { ADVERTISMENT_TYPE, DEFAULT_ADVERTISMENT_TYPE } = require("../../constants/ads")

// Create ad Schema

const adSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ADVERTISMENT_TYPE,
        default: DEFAULT_ADVERTISMENT_TYPE
    },
    content: {
        ar: {
            type: String,
            required: this.type === "text",
        },
        en: {
            type: String,
            required: this.type === "text",
        },
        de: {
            type: String,
            required: this.type === "text",
        },
        tr: {
            type: String,
            required: this.type === "text",
        },
    },
    imagePath: String,
}, { timestamps: true });

// Create Ad Model From Ad Schema

const adModel = mongoose.model("ad", adSchema);

module.exports = adModel;