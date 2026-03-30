const adminsTranslations = require("./admins");
const globalPasswordsTranslations = require("./global_passwords");
const linksTranslations = require("./links");
const messagesTranslations = require("./messages");
const officesTranslations = require("./offices");
const propertyValuationTranslations = require("./property-valuation");
const usersTranslations = require("./users");
const verificationCodesTranslations = require("./verification_codes");

module.exports = {
    ...adminsTranslations,
    ...globalPasswordsTranslations,
    ...linksTranslations,
    ...messagesTranslations,
    ...officesTranslations,
    ...propertyValuationTranslations,
    ...usersTranslations,
    ...verificationCodesTranslations
}