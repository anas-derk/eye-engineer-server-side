const {
    responsesHelpers,
    translationHelpers,
    emailsHelpers,
} = require("../../helpers");

const {
    sendReceiveMessageEmail,
} = emailsHelpers;

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const messagesOPerationsManagmentFunctions = require("../../respositories/messages");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = { $regex: new RegExp(`^${filters[objectKey]}`, 'i') };
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postSendMessage(req, res) {
    try {
        const result = await messagesOPerationsManagmentFunctions.addMessage(req.body, req.query.language);
        res.json(result);
        try {
            await sendReceiveMessageEmail(process.env.BUSSINESS_EMAIL, result.data);
        } catch (err) {
            console.log(err);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getMessagesCount(req, res) {
    try {
        const result = await messagesOPerationsManagmentFunctions.getMessagesCount(req.data._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllMessagesInsideThePage(req, res) {
    try {
        const filters = req.query;
        const result = await messagesOPerationsManagmentFunctions.getAllMessagesInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteMessage(req, res) {
    try {
        const result = await messagesOPerationsManagmentFunctions.deleteMessage(req.data._id, req.params.messageId, req.query.language);
        if (result.error) {
            if (
                [
                    "Sorry, This Admin Is Not Found !!",
                    "Sorry, Permission Denied Because This Admin Is Not Website Owner !!"
                ].includes(result.msg)) {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postSendMessage,
    getMessagesCount,
    getAllMessagesInsideThePage,
    deleteMessage
}