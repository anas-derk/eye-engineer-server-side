const {
    responsesHelpers,
    translationHelpers,
} = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations, translateSentensesByAPI } = translationHelpers;

const newsOPerationsManagmentFunctions = require("../../respositories/news");

async function postAddNews(req, res) {
    try {
        const { content } = req.body;
        const contentAfterTranslation = {
            ar: (await translateSentensesByAPI([content], "AR"))[0].text,
            en: (await translateSentensesByAPI([content], "EN"))[0].text,
            de: (await translateSentensesByAPI([content], "DE"))[0].text,
            tr: (await translateSentensesByAPI([content], "TR"))[0].text
        };
        const result = await newsOPerationsManagmentFunctions.addNews(req.data._id, contentAfterTranslation, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, Can't Add New News Because Arrive To Max Limits For News Count ( Limits: 10 ) !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllNews(req, res) {
    try {
        const result = await newsOPerationsManagmentFunctions.getAllNews(req.data._id, req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putNewsContent(req, res) {
    try {
        res.json(await newsOPerationsManagmentFunctions.updateNewsContent(req.data._id, req.params.id, req.body.content, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteNews(req, res) {
    try {
        const result = await newsOPerationsManagmentFunctions.deleteNews(req.data._id, req.params.id, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This News Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postAddNews,
    getAllNews,
    putNewsContent,
    deleteNews
}