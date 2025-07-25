const mongoose = require("mongoose");

const { resolve } = require("path");

require("dotenv").config({
    path: resolve(__dirname, "../../../.env"),
});

// Create Global Password Schema

const globalPasswordSchema = mongoose.Schema({
    email: String,
    password: String,
});

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("global_password", globalPasswordSchema);

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

const bussinessInfo = {
    email: process.env.BUSSINESS_EMAIL,
    password: process.env.BUSSINESS_EMAIL_PASSWORD,
};

async function create_initial_global_passwords() {
    try {
        await mongoose.connect(process.env.DB_URL);
        let user = await globalPasswordModel.findOne({ email: bussinessInfo.email });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Insert Global Password To Database Because it is Exist !!!";
        } else {
            const password = bussinessInfo.password;
            const encrypted_password = cryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
            bussinessInfo.password = encrypted_password;
            const new_global_password = new globalPasswordModel(bussinessInfo);
            await new_global_password.save();
            await mongoose.disconnect();
            return "Ok !!, Create Initial Global Password Has Been Successfuly !!";
        }
    } catch (err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_initial_global_passwords()
    .then((result) => { console.log(result); process.exit(1); })
    .catch((err) => console.log(err.message));