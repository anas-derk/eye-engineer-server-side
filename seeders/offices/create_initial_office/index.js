const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

const officeConstants = require("../../../constants/offices");

// Create Office Schema

const officeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerFullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: officeConstants.DEFAULT_OFFICE_STATUS,
        enum: officeConstants.OFFICE_STATUS,
    },
    isMainOffice: Boolean,
    creatingOrderDate: {
        type: Date,
        default: Date.now,
    },
    approveDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
    blockingReason: String,
});

// Create Office Model From Office Schema

const officeModel = mongoose.model("office", officeSchema);

const officeInfo = {
    name: "Eye Engineer",
    ownerFullName: "Soliman Asfour",
    email: process.env.MAIN_ADMIN_EMAIL,
    phoneNumber: "00963941519404",
    description: "Eye Engineer Description",
    status: "approving",
    isMainOffice: true,
    approveDate: Date.now(),
};

async function create_initial_office() {
    try {
        await mongoose.connect(process.env.DB_URL);
        await (new officeModel(officeInfo)).save();
        await mongoose.disconnect();
        return "Ok !!, Create Initial Office Process Has Been Successfuly !!";
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_initial_office()
    .then((result) => { console.log(result); process.exit(1); })
    .catch((err) => console.log(err.message));