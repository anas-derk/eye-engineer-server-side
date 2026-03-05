const adminsTranslations = require("./admins");
const globalPasswordsTranslations = require("./global_passwords");
const messagesTranslations = require("./messages");
const officesTranslations = require("./offices");
const usersTranslations = require("./users");
const verificationCodesTranslations = require("./verification_codes");

module.exports = {
    ...adminsTranslations,
    ...globalPasswordsTranslations,
    ...messagesTranslations,
    ...officesTranslations,
    ...usersTranslations,
    ...verificationCodesTranslations
}