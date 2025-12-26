const commonTranslations = require("./common");
const globalTranslations = require("./global");
const sectionsTranslations = require("./sections");

module.exports = {
    ...commonTranslations,
    ...globalTranslations,
    ...sectionsTranslations,
}