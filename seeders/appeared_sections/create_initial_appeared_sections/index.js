const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

// create Appeared Sections Schema For Appeared Sections Model

const appeared_sections_schema = mongoose.Schema({
    sectionName: String,
    isAppeared: {
        type: Boolean,
        default: false,
    },
});

// create Appeared Sections Model In Database

const appeared_sections_model = mongoose.model("appeared_sections", appeared_sections_schema);

const appeared_sections = [
    {
        sectionName: "brands",
        isAppeared: true,
    },
    {
        sectionName: "whatsapp button",
        isAppeared: false,
    },
    {
        sectionName: "add your store",
        isAppeared: false,
    },
    {
        sectionName: "stores",
        isAppeared: false,
    },
    {
        sectionName: "binance payment method",
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