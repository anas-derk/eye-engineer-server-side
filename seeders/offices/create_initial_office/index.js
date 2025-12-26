const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

const officeModel = require("../../../models/office");

const officeInfo = {
    name: "Eye Engineer",
    ownerFullName: "Soliman Asfour",
    email: process.env.MAIN_ADMIN_EMAIL,
    phoneNumber: "00963941519404",
    description: "Eye Engineer Description",
    services: ["All"],
    experiences: ["All"],
    status: "approving",
    isMainOffice: true,
    approveDate: Date.now(),
    imagePath: "assets/images/defaultOfficeImage.jpg"
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