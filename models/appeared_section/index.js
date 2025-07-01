const mongoose = require("../../database");

// Create Appeared Section Schema

const appearedSectionSchema = new mongoose.Schema({
    sectionName: String,
    isAppeared: {
        type: Boolean,
        default: false,
    },
});

// Create Appeared Section Model From Appeared Section Schema

const appearedSectionModel = mongoose.model("appeared_sections", appearedSectionSchema);

module.exports = appearedSectionModel;