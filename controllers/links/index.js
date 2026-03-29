const { responsesHelpers, translationHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations, translateSentensesByAPI } = translationHelpers;

const linksOperationsManagmentFunctions = require("../../respositories/links");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "officeId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "title") filtersObject[objectKey] = { $regex: new RegExp(`^${filters[objectKey]}`, 'i') };
        if (objectKey === "geometry") filtersObject[objectKey] = { $regex: new RegExp(`^${filters[objectKey]}`, 'i') };
    }
    if (!filtersObject["officeId"]) filtersObject["isMainStore"] = true;
    return filtersObject;
}

async function postNewLink(req, res) {
    try {
        const { title, url, geometries } = req.body;
        const linkInfo = {
            title: {
                ar: (await translateSentensesByAPI([title], "AR"))[0].text,
                en: (await translateSentensesByAPI([title], "EN"))[0].text,
                de: (await translateSentensesByAPI([title], "DE"))[0].text,
                tr: (await translateSentensesByAPI([title], "TR"))[0].text
            },
            url,
            geometries,
        };
        const result = await linksOperationsManagmentFunctions.addNewLink(req.data._id, linkInfo, req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getLinksCount(req, res) {
    try {
        res.json(await linksOperationsManagmentFunctions.getLinksCount(getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllLinksInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await linksOperationsManagmentFunctions.getAllLinksInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, filters.userType, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putLinkInfo(req, res) {
    try {
        const result = await linksOperationsManagmentFunctions.updateLinkInfo(req.data._id, req.params.linkId, req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Link Is Not Exist !!") {
                return res.status(401).json(getResponseObject(result, true, {}));
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteLink(req, res) {
    try {
        const result = await linksOperationsManagmentFunctions.deleteLink(req.data._id, req.params.linkId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Link Is Not Exist !!") {
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
    postNewLink,
    getLinksCount,
    getAllLinksInsideThePage,
    putLinkInfo,
    deleteLink,
}