const mongoose = require("../../database");

// Create News Schema

const newsSchema = new mongoose.Schema({
    content: {
        ar: {
            type: String,
            required: true,
        },
        en: {
            type: String,
            required: true,
        },
        tr: {
            type: String,
            required: true,
        },
        de: {
            type: String,
            required: true,
        },
    },
    dateOfCreation: {
        type: Date,
        default: Date.now,
    },
});

// Create News Model From News Schema

const newsModel = mongoose.model("new", newsSchema);

module.exports = newsModel;