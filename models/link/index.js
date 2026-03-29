const mongoose = require("../../database");

// Create Link Schema

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Link title is required"],
        trim: true,
        minlength: [2, "Link title must be at least 2 characters"],
        maxlength: [100, "Link title cannot exceed 100 characters"]
    },
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Office ID is required"],
        trim: true,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: "Invalid office ID"
        }
    },
    geometries: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "geometry",
            validate: {
                validator: function (v) {
                    return !v || mongoose.Types.ObjectId.isValid(v);
                },
                message: "Invalid geometry ID"
            }
        }],
        default: []
    },
}, { timestamps: true });

linkSchema.index({ officeId: 1 });

linkSchema.index({ title: 1 });

linkSchema.index({ createdAt: -1 });

// Create Link Model From Link Schema

const linkModel = mongoose.model("link", linkSchema);

module.exports = linkModel;