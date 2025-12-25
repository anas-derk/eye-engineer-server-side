// Import User, Admin Model Object

const { newsModel, adminModel } = require("../../models");

// Define Create New User Function

const { getSuitableTranslations } = require("../../helpers/translation");

async function addNews(authorizationId, content, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                if (await newsModel.countDocuments({}) >= 10) {
                    return {
                        msg: getSuitableTranslations("Sorry, Can't Add New News Because Arrive To Max Limits For News Count ( Limits: 10 ) !!", language),
                        error: true,
                        data: {},
                    }
                }
                const newNews = await (new newsModel({
                    content,
                })).save();
                return {
                    msg: getSuitableTranslations("Add New News Process Has Been Successfully !!", language),
                    error: false,
                    data: newNews,
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

async function getAllNews(authorizationId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get All News Process Has Been Successfully !!", language),
                    error: false,
                    data: await newsModel.find().sort({ dateOfCreation: -1 }),
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

async function updateNewsContent(authorizationId, newsId, newContent, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const newsInfo = await newsModel.findById(newsId);
                if (newsInfo) {
                    await newsModel.updateOne({ _id: newsId }, { content: newContent });
                    return {
                        msg: getSuitableTranslations("Updating News Content Process Has Been Successfuly !!", language),
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
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteNews(authorizationId, newsId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const news = await newsModel.findOneAndDelete({ _id: newsId });
                if (news) {
                    return {
                        msg: getSuitableTranslations("Deleting News Process Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This News Is Not Exist !!", language),
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
    addNews,
    getAllNews,
    updateNewsContent,
    deleteNews
}