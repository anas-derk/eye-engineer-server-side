// Import Global Password Model And Admin Model Object

const { globalPasswordModel, adminModel } = require("../../models");

// require cryptoJs module for password encrypting

const { AES, enc } = require("crypto-js");

const { getSuitableTranslations } = require("../../helpers/translation");

async function getPasswordForBussinessEmail(email, language) {
    try {
        const user = await globalPasswordModel.findOne({ email });
        if (user) {
            return {
                msg: getSuitableTranslations("Get Password For Bussiness Email Process Has Been Successfully !!", language),
                error: false,
                data: AES.decrypt(user.password, process.env.SECRET_KEY).toString(enc.Utf8),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, Email Incorrect !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function changeBussinessEmailPassword(authorizationId, email, password, newPassword, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const user = await globalPasswordModel.findOne({ email });
                if (user) {
                    if (AES.decrypt(user.password, process.env.SECRET_KEY).toString(enc.Utf8) === password) {
                        await globalPasswordModel.updateOne({ password: AES.encrypt(newPassword, process.env.SECRET_KEY).toString() });
                        return {
                            msg: getSuitableTranslations("Changing Bussiness Email Password Process Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getPasswordForBussinessEmail,
    changeBussinessEmailPassword,
}