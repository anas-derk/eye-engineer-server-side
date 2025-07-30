const mongoose = require("../../database");

// Create News Schema

const newsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    dateOfCreation: {
        type: Date,
        default: Date.now,
    },
});

// Create News Model From News Schema

const newsModel = mongoose.model("new", newsSchema);

module.exports = newsModel;