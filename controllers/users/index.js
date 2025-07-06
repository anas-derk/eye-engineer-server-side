const {
    responsesHelpers,
    translationHelpers,
    processingHelpers,
} = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const usersOPerationsManagmentFunctions = require("../../respositories/users");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "isVerified") filtersObject[objectKey] = Boolean(filters[objectKey]);
    }
    return filtersObject;
}

async function getUserInfo(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.getUserInfo(req.data._id, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getUsersCount(req, res) {
    try {
        const result = await usersOPerationsManagmentFunctions.getUsersCount(req.data._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllUsersInsideThePage(req, res) {
    try {
        const filters = req.query;
        const result = await usersOPerationsManagmentFunctions.getAllUsersInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putUserInfo(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.updateUserInfo(req.data._id, req.body, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putUserImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/users/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await usersOPerationsManagmentFunctions.changeUserImage(req.data._id, outputImageFilePath, req.query.language);
        if (!result.error) {
            const oldUserImagePath = result.data.deletedUserImagePath;
            if (oldUserImagePath && oldUserImagePath !== "assets/images/defaultProfileImage.png") {
                unlinkSync(oldUserImagePath);
            }
            res.json({
                ...result,
                data: {
                    newImagePath: outputImageFilePath,
                }
            });
        } else {
            unlinkSync(outputImageFilePath);
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteUser(req, res) {
    try {
        const { userType, userId } = req.query;
        const result = await usersOPerationsManagmentFunctions.deleteUser(req.data._id, userType, userId, req.query.language);
        if (result.error) {
            if (
                [
                    "Sorry, This User Is Not Found !!",
                    "Sorry, This Admin Is Not Found !!",
                    "Sorry, Permission Denied Because This Admin Is Not Website Owner !!"
                ].includes(result.msg)) {
                return res.status(401).json(result);
            }
            const deletedUserImagePath = result.data.deletedUserImagePath;
            if (deletedUserImagePath && deletedUserImagePath !== "assets/images/defaultProfileImage.png") {
                unlinkSync(deletedUserImagePath);
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
    getUserInfo,
    getUsersCount,
    getAllUsersInsideThePage,
    putUserInfo,
    putUserImage,
    deleteUser
}