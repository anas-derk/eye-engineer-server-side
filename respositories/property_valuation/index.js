// Import Required Models

const { propertyValuationModel, adminModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function createOrder(orderInfo, language) {
    try {
        const newPropertyValuationOrder = await (new propertyValuationModel({
            owner: orderInfo.owner,
            fullName: orderInfo.fullName,
            ...orderInfo.representativeFullName && { representativeFullName: orderInfo.representativeFullName },
            ...orderInfo.legalEntity && { legalEntity: orderInfo.legalEntity },
            city: orderInfo.city,
            phoneNumber: orderInfo.phoneNumber,
            whatsappNumber: orderInfo.whatsappNumber,
            email: orderInfo.email,
            location: orderInfo.location,
            purpose: orderInfo.purpose,
        })).save();
        return {
            msg: getSuitableTranslations("Create Property Valuation Order Process Has Been Successfully !!", language),
            error: false,
            data: newPropertyValuationOrder,
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getOrdersCount(authorizationId, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get Property Valuation Orders Count Process Has Been Successfully !!", language),
                    error: false,
                    data: await propertyValuationModel.countDocuments(filters),
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

async function getAllOrdersInsideThePage(authorizationId, pageNumber, pageSize, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get All Property Valuation Orders Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        messages: await propertyValuationModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ createdAt: -1 }),
                        messagesCount: await propertyValuationModel.countDocuments(filters)
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

async function deleteOrder(authorizationId, orderId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const propertyValuationOrder = await propertyValuationModel.findOne({
                    _id: orderId,
                });
                if (propertyValuationOrder) {
                    await propertyValuationOrder.deleteOne();
                    return {
                        msg: getSuitableTranslations("Deleting Property Valuation Order Process Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Deleting Property Valuation Order Process Has Been Successfully !!", language),
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
    createOrder,
    getOrdersCount,
    getAllOrdersInsideThePage,
    deleteOrder
}