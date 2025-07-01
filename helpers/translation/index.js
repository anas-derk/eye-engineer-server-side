const { translationUtils } = require("../../utils");

const arTranslations = require("../../locals/ar/index.json");
const trTranslations = require("../../locals/tr/index.json");
const deTranslations = require("../../locals/de/index.json");

function getSuitableTranslations(msg, language, variables = {}) {
    if (language) {
        switch (language) {
            case "ar": return translationUtils.processingTranslation(variables, arTranslations[msg] ? arTranslations[msg] : msg);
            case "tr": return translationUtils.processingTranslation(variables, trTranslations[msg] ? trTranslations[msg] : msg);
            case "de": return translationUtils.processingTranslation(variables, deTranslations[msg] ? deTranslations[msg] : msg);
            default: return translationUtils.processingTranslation(variables, msg);
        }
    }
    return {
        en: translationUtils.processingTranslation(variables, msg),
        ar: translationUtils.processingTranslation(variables, arTranslations[msg] ? arTranslations[msg] : msg),
        tr: translationUtils.processingTranslation(variables, trTranslations[msg] ? trTranslations[msg] : msg),
        de: translationUtils.processingTranslation(variables, deTranslations[msg] ? deTranslations[msg] : msg)
    }
}

module.exports = {
    getSuitableTranslations
}