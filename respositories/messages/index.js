// Import Required Models

const { messageModel, adminModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function addMessage(messageInfo, language) {
    try {
        const newMessge = await (new messageModel({
            name: messageInfo.name,
            email: messageInfo.email,
            subject: messageInfo.subject,
            content: messageInfo.content
        })).save();
        return {
            msg: getSuitableTranslations("Send This Message Process Has Been Successfully !!", language),
            error: false,
            data: newMessge,
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getMessagesCount(authorizationId, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get Messages Count Process Has Been Successfully !!", language),
                    error: false,
                    data: await messageModel.countDocuments(filters),
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

async function getAllMessagesInsideThePage(authorizationId, pageNumber, pageSize, filters, language) {
    try {
        const user = await adminModel.findById(authorizationId);
        if (user) {
            if (user.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get All Messages Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        messages: await messageModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ dateOfCreation: -1 }),
                        messagesCount: await messageModel.countDocuments(filters)
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

async function deleteMessage(authorizationId, messageId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const message = await messageModel.findOne({
                    _id: messageId,
                });
                if (message) {
                    await message.deleteOne();
                    return {
                        msg: getSuitableTranslations("Deleting Message Process Has Been Successfuly !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Message Is Not Exist !!", language),
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
    addMessage,
    getMessagesCount,
    getAllMessagesInsideThePage,
    deleteMessage
}