// Import User, Account Verification Codes And Product Model Object

const { userModel, verificationCodeModel, adminModel } = require("../../models");

// require bcryptjs module for password encrypting

const { hash, compare } = require("bcryptjs");

// Define Create New User Function

const { getSuitableTranslations } = require("../../helpers/translation");

async function createNewUser(name, email, password, language) {
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            return {
                msg: getSuitableTranslations("Sorry, Can't Create New User Because It Is Already Exist !!", language),
                error: true,
                data: {},
            }
        }
        await (new userModel({
            name,
            email,
            password: await hash(password, 10),
            language
        })).save();
        return {
            msg: getSuitableTranslations("Creating New User Process Has Been Successfuly !!", language),
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function login(email, password, language) {
    try {
        const user = await userModel.findOne({ email, provider: "same-site" });
        if (user) {
            if (await compare(password, user.password)) {
                return {
                    msg: getSuitableTranslations("Logining Process Has Been Successfully !!", language),
                    error: false,
                    data: {
                        _id: user._id,
                        isVerified: user.isVerified,
                        provider: "same-site"
                    },
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                error: true,
                data: {},
            };
        }
        return {
            msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function loginByGoogle(userInfo, language) {
    try {
        const user = userInfo.userType === "user" ? await userModel.findOne({ email: userInfo.email, provider: "google" }) : await userModel.findOne({ email: userInfo.email });
        if (user) {
            return {
                msg: getSuitableTranslations("Logining Process By Google Has Been Successfully !!", language),
                error: false,
                data: {
                    _id: user._id,
                    isVerified: user.isVerified,
                    provider: "google",
                },
            };
        }
        if (userInfo.userType === "user") {
            const { _id, isVerified } = await (new userModel({
                email: userInfo.email,
                name: userInfo.name,
                password: await hash(process.env.SECRET_KEY, 10),
                isVerified: true,
                provider: "google",
                language,
            })).save();
            return {
                msg: getSuitableTranslations("Logining Process By Google Has Been Successfully !!", language),
                error: false,
                data: {
                    _id,
                    isVerified,
                    provider: "google"
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function isExistUserAndVerificationEmail(email, language) {
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                return {
                    msg: getSuitableTranslations("This User Is Exist !!", language),
                    error: false,
                    data: user,
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Email Has Been Verified !!", language),
                error: true,
                data: {},
            };
        };
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        };
    } catch (err) {
        throw Error(err);
    }
}

async function isExistUserAccount(email, userType, language) {
    try {
        if (userType === "user") {
            const user = await userModel.findOne({ email });
            if (user) {
                return {
                    msg: getSuitableTranslations("User Is Exist !!", language),
                    error: false,
                    data: {
                        _id: user._id,
                        isVerified: user.isVerified,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        const admin = await adminModel.findOne({ email });
        if (admin) {
            return {
                msg: getSuitableTranslations("Admin Is Exist !!", language),
                error: false,
                data: {
                    _id: admin._id,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function updateVerificationStatus(email, language) {
    try {
        const userInfo = await userModel.findOneAndUpdate({ email }, { isVerified: true });
        if (userInfo) {
            await verificationCodeModel.deleteOne({ email, typeOfUse: "to activate account" });
            return {
                msg: getSuitableTranslations("Updating Verification Status Process Has Been Successfully !!", language),
                error: false,
                data: {
                    _id: userInfo._id,
                    isVerified: userInfo.isVerified,
                },
            };
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function resetUserPassword(email, userType, newPassword, language) {
    try {
        if (userType === "user") {
            const user = await userModel.findOneAndUpdate({ email }, { password: await hash(newPassword, 10) });
            if (user) {
                return {
                    msg: getSuitableTranslations("Reseting Password Process Has Been Successfully !!", language),
                    error: false,
                    data: {
                        language: user.language,
                    },
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        const admin = await adminModel.findOneAndUpdate({ email }, { password: await hash(newPassword, 10) });
        if (admin) {
            return {
                msg: getSuitableTranslations("Reseting Password Process Has Been Successfully !!", language),
                error: false,
                data: {
                    language: admin.language,
                },
            };
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    createNewUser,
    login,
    loginByGoogle,
    isExistUserAccount,
    isExistUserAndVerificationEmail,
    updateVerificationStatus,
    resetUserPassword,
}