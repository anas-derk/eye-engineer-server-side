// Import Required Models

const { adModel, adminModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function addNewAd(authorizationId, adsInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                if (await adModel.countDocuments({ type: adsInfo.type }) >= 10) {
                    return {
                        msg: getSuitableTranslations("Sorry, Can't Add New Ad Because Arrive To Max Limits For Ads Count ( Limits: 10 ) !!", language),
                        error: true,
                        data: {},
                    }
                }
                const newAd = await (new adModel(adsInfo)).save();
                return {
                    msg: getSuitableTranslations("Adding New Text Ad Process Has Been Successfully !!", language),
                    error: false,
                    data: newAd,
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
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllAds(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Ads Process Has Been Successfully !!", language),
            error: false,
            data: await adModel.find(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateAdImage(authorizationId, adId, newAdImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const adInfo = await adModel.findById(adId);
                if (adInfo) {
                    const oldImagePath = adInfo.imagePath;
                    adInfo.imagePath = newAdImagePath;
                    await adInfo.save();
                    return {
                        msg: getSuitableTranslations("Change Ad Image Process Has Been Successfully !!", language),
                        error: false,
                        data: {
                            oldAdImagePath: oldImagePath,
                            newAdImagePath
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
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

async function updateAd(authorizationId, adId, content, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const adInfo = await adModel.findById(adId);
                if (adInfo) {
                    adInfo.content = content;
                    await adInfo.save();
                    return {
                        msg: getSuitableTranslations("Updating Text Ad Content Process Has Been Successfuly !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
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
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteAd(authorizationId, adId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const adInfo = await adModel.findById(adId);
                if (adInfo) {
                    const deleteImagePath = adInfo.imagePath;
                    await adInfo.deleteOne({});
                    return {
                        msg: getSuitableTranslations("Deleting Ad Process Has Been Successfuly !!", language),
                        error: false,
                        data: {
                            deletedAdImagePath: deleteImagePath
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
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
    addNewAd,
    getAllAds,
    updateAdImage,
    updateAd,
    deleteAd,
}