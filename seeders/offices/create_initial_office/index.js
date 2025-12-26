const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

const officeModel = require("../../../models/office");

const officeInfo = {
    name: {
        ar: "عين المهندس",
        en: "Eye Engineer",
        de: "Augen-Ingenieur",
        tr: "Göz Mühendisi"
    },
    ownerFullName: "Soliman Asfour",
    email: process.env.MAIN_ADMIN_EMAIL,
    phoneNumber: "00963941519404",
    description: {
        ar: "المكتب الرئيسي",
        en: "Main Office",
        de: "Hauptbüro",
        tr: "Ana Ofis"
    },
    services: [
        {
            ar: "الكل",
            en: "All",
            de: "Alle",
            tr: "Tüm"
        }
    ],
    experiences: [
        {
            ar: "الكل",
            en: "All",
            de: "Alle",
            tr: "Tüm"
        }
    ],
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