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
        const user = await userModel.findOne({ email: userInfo.email, provider: "google" });
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
        const { _id, isVerified } = await (new userModel({
            email: userInfo.email,
            name: userInfo.name,
            password: await hash(process.env.secretKey, 10),
            isVerified: true,
            provider: "google",
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
    catch (err) {
        throw Error(err);
    }
}

async function getUserInfo(userId, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            return {
                msg: getSuitableTranslations("Get User Info Process Has Been Successfully !!", language),
                error: false,
                data: user,
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
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

async function getUsersCount(authorizationId, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get Users Count Process Has Been Successfully !!", language),
                    error: false,
                    data: await userModel.countDocuments(filters),
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
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

async function getAllUsersInsideThePage(authorizationId, pageNumber, pageSize, filters, language) {
    try {
        const user = await userModel.findById(authorizationId);
        if (user) {
            if (user.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get All Users Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        users: await userModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ dateOfCreation: -1 }),
                        usersCount: await userModel.countDocuments(filters)
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
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

async function updateUserInfo(userId, newUserData, language) {
    try {
        const userInfo = await userModel.findById(userId);
        if (userInfo) {
            let newUserInfo = newUserData;
            if (newUserData.password && newUserData.newPassword) {
                if (!(await compare(newUserData.password, userInfo.password))) {
                    return {
                        msg: getSuitableTranslations("Sorry, This Password Is Uncorrect !!", language),
                        error: true,
                        data: {},
                    }
                }
                newUserInfo = {
                    ...newUserData,
                    password: await hash(newUserData.newPassword, 10),
                }
            }
            if (newUserData.email && newUserData.email !== userInfo.email) {
                const user = await userModel.findOne({ email: newUserData.email });
                if (user) {
                    return {
                        msg: getSuitableTranslations("Sorry, This Email Is Already Exist !!", language),
                        error: true,
                        data: {},
                    }
                }
            }
            await userModel.updateOne({ _id: userId }, newUserInfo);
            return {
                msg: getSuitableTranslations("Updating User Info Process Has Been Successfuly !!", language),
                error: false,
                data: {},
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

async function changeUserImage(authorizationId, newUserImagePath, language) {
    try {
        const user = await userModel.findOneAndUpdate({ _id: authorizationId }, { imagePath: newUserImagePath });
        if (user) {
            return {
                msg: getSuitableTranslations("Updating User Image Process Has Been Successfully !!", language),
                error: false,
                data: { deletedUserImagePath: user.imagePath }
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteUser(authorizationId, userType = "user", userId, language) {
    try {
        const user = userType === "user" ? await userModel.findByIdAndDelete(authorizationId) : await userModel.findById(authorizationId);
        if (user) {
            if (userType === "user") {
                return {
                    msg: getSuitableTranslations("Deleting User Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            else {
                if (user.isWebsiteOwner) {
                    const user = await userModel.findOneAndDelete({ _id: userId });
                    if (user) {
                        return {
                            msg: getSuitableTranslations("Deleting User Process Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                    error: true,
                    data: {},
                }
            }
        }
        return {
            msg: getSuitableTranslations(`Sorry, This ${userType.replace(userType[0], userType[0].toUpperCase())} Is Not Exist !!`, language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    createNewUser,
    login,
    loginByGoogle,
    getUserInfo,
    isExistUserAccount,
    isExistUserAndVerificationEmail,
    getUsersCount,
    getAllUsersInsideThePage,
    updateUserInfo,
    updateVerificationStatus,
    resetUserPassword,
    changeUserImage,
    deleteUser
}