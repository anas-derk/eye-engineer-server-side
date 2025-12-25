const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

const { adminModel, officeModel } = require("../../../models");

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const adminInfo = {
    name: "Soliman Asfour",
    email: process.env.MAIN_ADMIN_EMAIL,
    password: process.env.MAIN_ADMIN_PASSWORD,
    isWebsiteOwner: true,
    isExistOffice: true,
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
        const mainOffice = await officeModel.findOne({ isMainOffice: true });
        if (mainOffice) {
            adminInfo.officeId = mainOffice._id;
            const encrypted_password = await hash(adminInfo.password, 10);
            adminInfo.password = encrypted_password;
            const new_admin_user = new adminModel(adminInfo);
            await new_admin_user.save();
            await mongoose.disconnect();
            return "Ok !!, Create Initial Admin Account Process Has Been Successfuly !!";
        }
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_initial_admin_account()
    .then((result) => { console.log(result); process.exit(1); })
    .catch((err) => console.log(err.message));