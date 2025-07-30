const {
    responsesHelpers,
    translationHelpers,
} = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const newsOPerationsManagmentFunctions = require("../../respositories/news");

async function postAddNewNews(req, res) {
    try {
        const result = await newsOPerationsManagmentFunctions.addNewNews(req.data._id, req.body.content, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, Can't Add New News Because Arrive To Max Limits For News Count ( Limits: 10 ) !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
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

async function putNewsInfo(req, res) {
    try {
        res.json(await newsOPerationsManagmentFunctions.updateUserInfo(req.data._id, req.body, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteNews(req, res) {
    try {
        const { newsId } = req.query;
        const result = await newsOPerationsManagmentFunctions.deleteNews(req.data._id, newsId, req.query.language);
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
    postAddNewNews,
    getAllNews,
    putNewsInfo,
    deleteNews
}