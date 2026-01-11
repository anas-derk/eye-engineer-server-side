const { responsesHelpers, translationHelpers, processingHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations, translateSentensesByAPI } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const geometriesManagmentFunctions = require("../../respositories/geometries");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "officeId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "name") filtersObject["$or"] = [
            { "name.ar": { $regex: new RegExp(`^${filters[objectKey]}`, 'i') } },
            { "name.en": { $regex: new RegExp(`^${filters[objectKey]}`, 'i') } },
            { "name.de": { $regex: new RegExp(`^${filters[objectKey]}`, 'i') } },
            { "name.tr": { $regex: new RegExp(`^${filters[objectKey]}`, 'i') } },
        ];
        if (objectKey === "geometryId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "parent") {
            if (filters[objectKey] === "null") {
                filtersObject[objectKey] = null;
            } else filtersObject[objectKey] = filters[objectKey];
        }
    }
    return filtersObject;
}

async function postNewGeometry(req, res) {
    try {
        const outputImageFilePath = `assets/images/geometries/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const { name, parent } = Object.assign({}, req.body);
        const geometryInfo = {
            name: {
                ar: (await translateSentensesByAPI([name], "AR"))[0].text,
                en: (await translateSentensesByAPI([name], "EN"))[0].text,
                de: (await translateSentensesByAPI([name], "DE"))[0].text,
                tr: (await translateSentensesByAPI([name], "TR"))[0].text
            },
            parent,
        };
        const result = await geometriesManagmentFunctions.addNewGeometry(req.data._id, {
            ...geometryInfo,
            imagePath: outputImageFilePath,
        }, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Geometry Is Already Exist !!" && result.msg !== "Sorry, This Parent Geometry Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getGeometryInfo(req, res) {
    try {
        res.json(await geometriesManagmentFunctions.getGeometryInfo(req.params.geometryId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getGeometriesCount(req, res) {
    try {
        res.json(await geometriesManagmentFunctions.getGeometriesCount(req.data._id, getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllGeometriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await geometriesManagmentFunctions.getAllGeometriesInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, filters.userType, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putGeometry(req, res) {
    try {
        const result = await geometriesManagmentFunctions.updateGeometry(req.data._id, req.params.geometryId, { name, parent } = req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Geometry Is Not Exist !!" || result.msg !== "Sorry, This Parent Geometry Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putGeometryImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/geometries/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await geometriesManagmentFunctions.changeGeometryImage(req.data._id, req.params.geometryId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedGeometryImagePath);
        }
        else {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteGeometry(req, res) {
    try {
        const result = await geometriesManagmentFunctions.deleteGeometry(req.data._id, req.params.geometryId, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedGeometryImagePath);
        }
        else {
            if (result.msg !== "Sorry, This Geometry Is Not Exist !!") {
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
    postNewGeometry,
    getGeometryInfo,
    getGeometriesCount,
    getAllGeometriesInsideThePage,
    putGeometry,
    putGeometryImage,
    deleteGeometry,
}