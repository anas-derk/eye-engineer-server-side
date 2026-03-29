const mongoose = require("../../database");

// Create Link Schema

const linkSchema = new mongoose.Schema({
    title: {
        ar: {
            type: String,
            required: [true, "Link Title In Arabic Is Required"],
            trim: true,
            minlength: [2, "Link title In Arabic must be at least 2 characters"],
            maxlength: [100, "Link title In Arabic cannot exceed 100 characters"]
        },
        en: {
            type: String,
            required: [true, "Link Title In English Is Required"],
            trim: true,
            minlength: [2, "Link title In English must be at least 2 characters"],
            maxlength: [100, "Link title In English cannot exceed 100 characters"]
        },
        de: {
            type: String,
            required: [true, "Link Title In German Is Required"],
            trim: true,
            minlength: [2, "Link title In German must be at least 2 characters"],
            maxlength: [100, "Link title In German cannot exceed 100 characters"]
        },
        tr: {
            type: String,
            required: [true, "Link Title In Turkish Is Required"],
            trim: true,
            minlength: [2, "Link title In Turkish must be at least 2 characters"],
            maxlength: [100, "Link title In Turkish cannot exceed 100 characters"]
        }
    },
    url: {
        type: String,
        required: [true, "Link URL Is Required"],
        trim: true,
        minlength: [5, "Link URL must be at least 5 characters"],
        maxlength: [2048, "Link URL cannot exceed 2048 characters"],
        validate: {
            validator: function (v) {
                const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
                return urlRegex.test(v);
            },
            message: "Invalid URL format"
        }
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
            ref: "geometrie",
            validate: {
                validator: function (v) {
                    return mongoose.Types.ObjectId.isValid(v);
                },
                message: "Invalid geometry ID"
            }
        }],
        required: [true, "Geometries IDs Array Is Required"],
    }
}, { timestamps: true });

linkSchema.index({ title: 1 });

linkSchema.index({ officeId: 1 });

linkSchema.index({ geometries: 1 });

linkSchema.index({ createdAt: -1 });

// Create Link Model From Link Schema

const linkModel = mongoose.model("link", linkSchema);

module.exports = linkModel;