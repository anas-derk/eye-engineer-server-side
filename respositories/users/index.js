// Import User, Admin Model Object

const { userModel, adminModel } = require("../../models");

// require bcryptjs module for password encrypting

const { hash, compare } = require("bcryptjs");

// Define Create New User Function

const { getSuitableTranslations } = require("../../helpers/translation");

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
        const admin = await adminModel.findById(userId);
        if (admin) {
            return {
                msg: getSuitableTranslations("Get Admin Info Process Has Been Successfully !!", language),
                error: false,
                data: admin,
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

async function deleteUser(authorizationId, userType, userId, language) {
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
    getUserInfo,
    getUsersCount,
    getAllUsersInsideThePage,
    updateUserInfo,
    changeUserImage,
    deleteUser
}