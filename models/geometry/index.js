const mongoose = require("../../database");

const counterModel = require("../../models/counter");

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
    order: {
        type: Number,
        unique: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

geometrySchema.pre("save", async function (next) {
    if (!this.isNew) return next();
    const counter = await counterModel.findOneAndUpdate(
        { name: "geometryNumber" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    this.order = counter.seq;
    next();
});

// Create Geometry Model From Geometry Schema

const geometryModel = mongoose.model("geometrie", geometrySchema);

module.exports = geometryModel;