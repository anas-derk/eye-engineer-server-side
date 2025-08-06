const { responsesHelpers, translationHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const globalPasswordsManagmentFunctions = require("../../respositories/global_passwords");

async function putChangeBussinessEmailPassword(req, res) {
    try {
        const { email, password, newPassword } = req.body;
        const { language } = req.query;
        const result = await globalPasswordsManagmentFunctions.changeBussinessEmailPassword(req.data._id, email.toLowerCase(), password, newPassword, req.query.language);
        const msgTranslate = getSuitableTranslations(result.msg, language);
        if (result.error) {
            if (result.msg !== "Sorry, Email Or Password Incorrect !!") {
                result.msg = msgTranslate;
                return res.status(401).json(result);
            }
        }
        result.msg = msgTranslate;
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}