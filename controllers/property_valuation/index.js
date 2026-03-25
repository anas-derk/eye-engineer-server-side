const {
    responsesHelpers,
    translationHelpers,
    emailsHelpers,
} = require("../../helpers");

const {
    sendConfirmRequestPropertyValuationArrivedEmail,
    sendReceivePropertyValuationOrderEmail
} = emailsHelpers;

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const propertyValuationOPerationsManagmentFunctions = require("../../respositories/property_valuation");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "owner") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "fullName") filtersObject[objectKey] = { $regex: new RegExp(`^${filters[objectKey]}`, 'i') };
        if (objectKey === "representativeFullName") filtersObject[objectKey] = { $regex: new RegExp(`^${filters[objectKey]}`, 'i') };
        if (objectKey === "city") filtersObject[objectKey] = { $regex: new RegExp(`^${filters[objectKey]}`, 'i') };
        if (objectKey === "phoneNumber") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "whatsappNumber") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postCreateOrder(req, res) {
    try {
        const language = req.query.language;
        const result = await propertyValuationOPerationsManagmentFunctions.createOrder(req.body, language);
        res.json(result);
        try {
            await sendConfirmRequestPropertyValuationArrivedEmail(result.data.email, language);
            await sendReceivePropertyValuationOrderEmail("anas.derk2023@gmail.com", result.data);
        } catch (err) {
            console.log(err);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getOrdersCount(req, res) {
    try {
        const result = await propertyValuationOPerationsManagmentFunctions.getOrdersCount(req.data._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllOrdersInsideThePage(req, res) {
    try {
        const filters = req.query;
        const result = await propertyValuationOPerationsManagmentFunctions.getAllOrdersInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteOrder(req, res) {
    try {
        const result = await propertyValuationOPerationsManagmentFunctions.deleteOrder(req.data._id, req.params.orderId, req.query.language);
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
    postCreateOrder,
    getOrdersCount,
    getAllOrdersInsideThePage,
    deleteOrder
}