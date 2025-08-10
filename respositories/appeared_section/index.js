// Import Admin Model Object

const { appearedSectionModel, adminModel, userModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function getAllSections(language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Sections Process Has Been Successfully !!", language),
            error: false,
            data: await appearedSectionModel.find({}),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function updateSectionsStatus(authorizationId, sectionsStatus, language) {
    try {
        const admin = await userModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                for (let i = 0; i < 8; i++) {
                    await appearedSectionModel.updateOne({ _id: sectionsStatus[i]._id }, { isAppeared: sectionsStatus[i].isAppeared });
                }
                return {
                    msg: getSuitableTranslations("Updating Sections Status Has Been Successfully !!", language),
                    error: false,
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
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    updateSectionsStatus,
    getAllSections,
}