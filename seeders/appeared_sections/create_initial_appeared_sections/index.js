const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

// create Appeared Sections Schema For Appeared Sections Model

const appearedSectionSchema = new mongoose.Schema({
    sectionName: {
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
    isAppeared: {
        type: Boolean,
        default: false,
    },
});

// create Appeared Sections Model In Database

const appeared_sections_model = mongoose.model("appeared_sections", appearedSectionSchema);

const appeared_sections = [
    {
        sectionName: {
            ar: "زر الواتس آب",
            en: "whatsapp button",
            tr: "whatsapp düğmesi",
            de: "whatsapp taste"
        },
        isAppeared: false,
    },
    {
        sectionName: {
            ar: "الهندسات",
            en: "geometries",
            tr: "geometriler",
            de: "geometrien"
        },
        isAppeared: false,
    },
    {
        sectionName: {
            ar: "الفيديوهات التعليمية",
            en: "educational videos",
            tr: "eğitici videolar",
            de: "lehrvideos"
        },
        isAppeared: false,
    },
    {
        sectionName: {
            ar: "الأحدث",
            en: "recents",
            tr: "son olanlar",
            de: "aktuelles"
        },
        isAppeared: false,
    },
    {
        sectionName: {
            ar: "المصطلحات",
            en: "terminologies",
            tr: "terminolojiler",
            de: "terminologien"
        },
        isAppeared: false,
    },
    {
        sectionName: {
            ar: "المكاتب",
            en: "offices",
            tr: "ofisler",
            de: "büros"
        },
        isAppeared: false,
    },
    {
        sectionName: {
            ar: "التقييم العقاري",
            en: "property valuation",
            tr: "mülk değerleme",
            de: "immobilienbewertung"
        },
        isAppeared: false,
    },
    {
        sectionName: {
            ar: "مقالات هندسية",
            en: "engineering articles",
            tr: "mühendislik makaleleri",
            de: "technische artikel"
        },
        isAppeared: false,
    },
];

async function create_initial_appeared_sections() {
    try {
        await mongoose.connect(process.env.DB_URL);
        await appeared_sections_model.insertMany(appeared_sections);
        await mongoose.disconnect();
        return "Ok !!, Create Initial Appeared Sections Account Has Been Successfuly !!";
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_initial_appeared_sections()
    .then((result) => { console.log(result); process.exit(1); })
    .catch((err) => console.log(err.message));