const { responsesHelpers, translationHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const categoriesManagmentFunctions = require("../../respositories/categories");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "name") filtersObject[objectKey] = { $regex: new RegExp(filters[objectKey], 'i') };
        if (objectKey === "categoryId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "parent") {
            if (filters[objectKey] === "null") {
                filtersObject[objectKey] = null;
            } else filtersObject[objectKey] = filters[objectKey];
        }
    }
    return filtersObject;
}

async function postNewCategory(req, res) {
    try {
        const result = await categoriesManagmentFunctions.addNewCategory(req.data._id, req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Cateogry Is Already Exist !!" && result.msg !== "Sorry, This Parent Cateogry Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllCategories(req, res) {
    try {
        const filters = req.query;
        res.json(await categoriesManagmentFunctions.getAllCategories(req.data._id, getFiltersObject(filters), filters.userType, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getCategoryInfo(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getCategoryInfo(req.params.categoryId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getCategoriesCount(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getCategoriesCount(req.data._id, getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllCategoriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await categoriesManagmentFunctions.getAllCategoriesInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, filters.userType, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteCategory(req, res) {
    try {
        const result = await categoriesManagmentFunctions.deleteCategory(req.data._id, req.params.categoryId, req.query.language);
        if (result.msg !== "Sorry, This Category Is Not Exist !!") {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putCategory(req, res) {
    try {
        const result = await categoriesManagmentFunctions.updateCategory(req.data._id, req.params.categoryId, { name, color, parent } = req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Category Is Not Exist !!" || result.msg !== "Sorry, This Parent Cateogry Is Not Exist !!") {
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
    postNewCategory,
    getAllCategories,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    getCategoryInfo,
    deleteCategory,
    putCategory,
    putCategoryImage,
}