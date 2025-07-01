function isValidLanguage(language) {
    return ["ar", "en", "de", "tr"].includes(language);
}

module.exports = {
    isValidLanguage
}