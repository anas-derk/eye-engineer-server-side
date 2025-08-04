const { translationUtils } = require("../../utils");

const arTranslations = require("../../locals/ar/index.json");
const trTranslations = require("../../locals/tr/index.json");
const deTranslations = require("../../locals/de/index.json");

const { post } = require("axios");

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

async function translateSentensesByAPI(sentenses, targetLanguage) {
    try {
        return (await post(`${process.env.TRANSLATE_BASE_API_URL}/v2/translate`, {
            text: sentenses,
            target_lang: targetLanguage
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `DeepL-Auth-Key ${process.env.TRANSLATE_API_KEY}`
            }
        })).data.translations;
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    getSuitableTranslations,
    translateSentensesByAPI
}