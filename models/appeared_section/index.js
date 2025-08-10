const mongoose = require("../../database");

// Create Appeared Section Schema

const appearedSectionSchema = new mongoose.Schema({
    sectionName: {
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
    isAppeared: {
        type: Boolean,
        default: false,
    },
});

// Create Appeared Section Model From Appeared Section Schema

const appearedSectionModel = mongoose.model("appeared_sections", appearedSectionSchema);

module.exports = appearedSectionModel;