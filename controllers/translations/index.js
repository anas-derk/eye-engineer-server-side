const {
    responsesHelpers,
    translationHelpers,
} = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations, translateSentensesByAPI } = translationHelpers;

async function postTranslate(req, res) {
    try {
        const { text, language } = req.body;
        const textAfterTranslation = (await translateSentensesByAPI([text], language.toUpperCase()))[0].text;
        res.json({
            msg: getSuitableTranslations("Translation Process Has Been Successfully !!", req.query.language),
            error: false,
            data: textAfterTranslation,
        });
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postTranslate,
}