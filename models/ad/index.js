const mongoose = require("mongoose");

// Create ad Schema

const adSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["text", "image"],
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