// Import Required Models

const { linkModel, userModel, adminModel } = require("../../models");

const mongoose = require("../../database");

const { getSuitableTranslations } = require("../../helpers/translation");

async function addNewLink(authorizationId, linkInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                linkInfo.officeId = admin.officeId;
                await (new linkModel(linkInfo)).save();
                return {
                    msg: getSuitableTranslations("Adding New Link Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getLinksCount(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Links Count Process Has Been Successfully !!", language),
            error: false,
            data: await linkModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllLinksInsideThePage(authorizationId, pageNumber, pageSize, userType, filters, language) {
    try {
        if (userType === "user") {
            const user = await userModel.findById(authorizationId);
            if (!user) {
                return {
                    msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }

        } else {
            const admin = await adminModel.findById(authorizationId);
            if (!admin) {
                return {
                    msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            filters.officeId = new mongoose.Types.ObjectId(admin.officeId);
        }
        return {
            msg: getSuitableTranslations("Get All Links Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: {
                links: await linkModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).populate("geometries"),
                linksCount: await linkModel.countDocuments(filters)
            },
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateLinkInfo(authorizationId, linkId, newLinkInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const linkInfo = await linkModel.findOne({ _id: linkId });
                if (linkInfo) {
                    if (linkInfo.officeId === admin.officeId) {
                        if (newLinkInfo.title) linkInfo.title = newLinkInfo.title;
                        if (newLinkInfo.url) linkInfo.url = newLinkInfo.url;
                        await linkInfo.save();
                        return {
                            msg: getSuitableTranslations("Updating Link Info Process Has Been Successfuly !!", language),
                            error: false,
                            data: {},
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Link Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Link Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteLink(authorizationId, linkId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const linkInfo = await linkModel.findOne({
                    _id: linkId,
                });
                if (linkInfo) {
                    if (linkInfo.officeId === admin.officeId) {
                        await linkInfo.deleteOne();
                        return {
                            error: false,
                            msg: getSuitableTranslations("Deleting Link Process Has Been Successfuly !!", language),
                            data: {}
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Link Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Link Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewLink,
    getLinksCount,
    getAllLinksInsideThePage,
    deleteLink,
    updateLinkInfo,
}