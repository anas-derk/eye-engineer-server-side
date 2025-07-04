const {
    responsesHelpers,
    emailsHelpers,
    translationHelpers,
    processingHelpers,
} = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const {
    sendVerificationCodeToUserEmail,
    sendCongratulationsOnCreatingNewAccountEmail,
    sendChangePasswordEmail
} = emailsHelpers;

const { getSuitableTranslations } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const { ACCESS_TOKEN_EXPIRE } = require("../../constants/tokens");

const usersOPerationsManagmentFunctions = require("../../respositories/users");

const { sign } = require("jsonwebtoken");

const {
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid
} = require("../../respositories/verification_codes");

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

async function login(req, res) {
    try {
        const { email, password } = req.query;
        const result = await usersOPerationsManagmentFunctions.login(email.toLowerCase(), password, req.query.language);
        if (!result.error) {
            res.json({
                msg: result.msg,
                error: result.error,
                data: {
                    ...result.data,
                    token: sign(result.data, process.env.SECRET_KEY, {
                        expiresIn: ACCESS_TOKEN_EXPIRE,
                    }),
                },
            });
            return;
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function loginWithGoogle(req, res) {
    try {
        const { email, name, language } = req.query;
        const result = await usersOPerationsManagmentFunctions.loginByGoogle({ email, name }, language);
        res.json({
            msg: result.msg,
            error: result.error,
            data: {
                ...result.data,
                token: sign(result.data, process.env.SECRET_KEY, {
                    expiresIn: ACCESS_TOKEN_EXPIRE,
                }),
            },
        });
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
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

async function getForgetPassword(req, res) {
    try {
        const { email, userType, language } = req.query;
        let result = await usersOPerationsManagmentFunctions.isExistUserAccount(email, userType, language);
        if (!result.error) {
            if (userType === "user") {
                if (!result.data.isVerified) {
                    return res.json({
                        msg: "Sorry, The Email For This User Is Not Verified !!",
                        error: true,
                        data: result.data,
                    });
                }
            }
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, "to reset password", language);
            if (result.error) {
                return res.json(result);
            }
            result = await sendVerificationCodeToUserEmail(email);
            if (!result.error) {
                return res.json(await addNewAccountVerificationCode(email, result.data, "to reset password", language));
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function createNewUser(req, res) {
    try {
        const { name, email, password, language } = req.body;
        const result = await usersOPerationsManagmentFunctions.createNewUser(name, email.toLowerCase(), password, language);
        if (result.error) {
            return res.json(result);
        }
        try {
            await sendCongratulationsOnCreatingNewAccountEmail(email, language);
        }
        catch (err) {
            consolel.log(err);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try {
        const { email, typeOfUse, userType, language } = req.query;
        let result = typeOfUse === "to activate account" && userType === "user" ? await usersOPerationsManagmentFunctions.isExistUserAndVerificationEmail(email, language) : usersOPerationsManagmentFunctions.isExistUserAccount(email, userType, language);
        if (!result.error) {
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, typeOfUse, language);
            if (result.error) {
                return res.json(result);
            }
            result = await sendVerificationCodeToUserEmail(email);
            if (!result.error) {
                return res.json(await addNewAccountVerificationCode(email, result.data, typeOfUse, language));
            }
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

async function putVerificationStatus(req, res) {
    try {
        const { email, code, language } = req.query;
        let result = await isAccountVerificationCodeValid(email, code, "to activate account", language);
        if (!result.error) {
            result = await usersOPerationsManagmentFunctions.updateVerificationStatus(email, language);
            if (!result.error) {
                return res.json({
                    msg: result.msg,
                    error: result.error,
                    data: {
                        ...result.data,
                        token: sign(result.data, process.env.SECRET_KEY, {
                            expiresIn: ACCESS_TOKEN_EXPIRE,
                        }),
                    },
                });
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putResetPassword(req, res) {
    try {
        const { email, userType, code, newPassword, language } = req.query;
        let result = await isAccountVerificationCodeValid(email, code, "to reset password", language);
        if (!result.error) {
            result = await usersOPerationsManagmentFunctions.resetUserPassword(email, userType, newPassword, language);
            if (!result.error) {
                await sendChangePasswordEmail(email, result.data.language)
            }
            return res.json(result);
        }
        res.json(result);
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
    createNewUser,
    postAccountVerificationCode,
    login,
    loginWithGoogle,
    getUserInfo,
    getUsersCount,
    getAllUsersInsideThePage,
    getForgetPassword,
    putUserInfo,
    putVerificationStatus,
    putResetPassword,
    putUserImage,
    deleteUser
}