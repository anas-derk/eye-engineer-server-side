const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

// create Admin User Schema For Admin User Model

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isWebsiteOwner: {
        type: Boolean,
        default: false,
    },
    isExistOffice: {
        type: Boolean,
        default: false,
    },
    officeId: {
        type: String,
        required: true,
    },
    permissions: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                    enum: [],
                },
                value: {
                    type: Boolean,
                    required: true,
                }
            },
        ],
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockingReason: String,
    creatingDate: {
        type: Date,
        default: Date.now,
    },
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// create Admin User Model In Database

const adminModel = mongoose.model("admin", adminSchema);

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const adminInfo = {
    name: "Soliman Asfour",
    email: process.env.MAIN_ADMIN_EMAIL,
    password: process.env.MAIN_ADMIN_PASSWORD,
    isWebsiteOwner: true,
    isExistOffice: true,
    officeId: "660b68f8877eb32dd398015c",
    permissions: [],
}

async function create_initial_admin_account() {
    try {
        await mongoose.connect(process.env.DB_URL);
        let user = await adminModel.findOne({ email: adminInfo.email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Insert Admin Data To Database Because it is Exist !!!";
        }
        const encrypted_password = await hash(adminInfo.password, 10);
        adminInfo.password = encrypted_password;
        const new_admin_user = new adminModel(adminInfo);
        await new_admin_user.save();
        await mongoose.disconnect();
        return "Ok !!, Create Initial Admin Account Process Has Been Successfuly !!";
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_initial_admin_account()
    .then((result) => { console.log(result); process.exit(1); })
    .catch((err) => console.log(err.message));