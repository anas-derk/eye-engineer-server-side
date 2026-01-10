const mongoose = require("../../database");

// Create Geometry Schema

const geometrySchema = new mongoose.Schema({
    name: {
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
    officeId: {
        type: mongoose.Types.ObjectId,
        ref: "office",
        required: true,
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "geometrie",
        default: null
    },
    imagePath: {
        type: String,
        required: true,
    },
});

// Create Geometry Model From Geometry Schema

const geometryModel = mongoose.model("geometrie", geometrySchema);

module.exports = geometryModel;