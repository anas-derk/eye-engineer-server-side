const {
    responsesHelpers,
    emailsHelpers,
    translationHelpers,
} = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const {
    sendVerificationCodeToUserEmail,
    sendCongratulationsOnCreatingNewAccountEmail,
    sendChangePasswordEmail
} = emailsHelpers;

const { getSuitableTranslations } = translationHelpers;

const { ACCESS_TOKEN_EXPIRE } = require("../../constants/tokens");

const authOPerationsManagmentFunctions = require("../../respositories/auth");

const { sign } = require("jsonwebtoken");

const {
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid
} = require("../../respositories/verification_codes");

async function postLogin(req, res) {
    try {
        const { userType, email, password } = req.body;
        const result = await authOPerationsManagmentFunctions.login(userType, email.toLowerCase(), password, req.query.language);
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

async function postLoginWithGoogle(req, res) {
    try {
        const { userType, email, name } = req.body;
        const result = await authOPerationsManagmentFunctions.loginByGoogle({ userType: userType ?? "user", email, name }, req.query.language);
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

async function postForgetPassword(req, res) {
    try {
        const { userType, email } = req.body;
        const { language } = req.query;
        let result = await authOPerationsManagmentFunctions.isExistUserAccount(email, userType, language);
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
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postCreateNewUser(req, res) {
    try {
        const { name, email, password, language } = req.body;
        const result = await authOPerationsManagmentFunctions.createNewUser(name, email.toLowerCase(), password, language);
        if (result.error) {
            return res.json(result);
        }
        res.json(result);
        try {
            await sendCongratulationsOnCreatingNewAccountEmail(email, language);
        }
        catch (err) {
            console.log(err);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try {
        const { email, typeOfUse, userType } = req.body;
        const { language } = req.query;
        let result = typeOfUse === "to activate account" && userType === "user" ? await authOPerationsManagmentFunctions.isExistUserAndVerificationEmail(email, language) : authOPerationsManagmentFunctions.isExistUserAccount(email, userType, language);
        if (!result.error) {
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, typeOfUse, language);
            if (result.error) {
                return res.json(result);
            }
            result = await sendVerificationCodeToUserEmail(email, language);
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

async function putVerificationStatus(req, res) {
    try {
        const { email, code } = req.body;
        const { language } = req.query;
        let result = await isAccountVerificationCodeValid(email, code, "to activate account", language);
        if (!result.error) {
            result = await authOPerationsManagmentFunctions.updateVerificationStatus(email, language);
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
        const { userType, email, code, newPassword } = req.body;
        const { language } = req.query;
        let result = await isAccountVerificationCodeValid(email, code, "to reset password", language);
        if (!result.error) {
            result = await authOPerationsManagmentFunctions.resetUserPassword(email, userType, newPassword, language);
            if (!result.error) {
                try {
                    await sendChangePasswordEmail(email, result.data.language);
                }
                catch (err) {
                    console.log(err);
                }
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
    postCreateNewUser,
    postAccountVerificationCode,
    postLogin,
    postLoginWithGoogle,
    postForgetPassword,
    putVerificationStatus,
    putResetPassword,
}