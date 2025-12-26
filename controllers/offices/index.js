const { responsesHelpers, translationHelpers, processingHelpers, emailsHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations, translateSentensesByAPI } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const {
    sendApproveOfficeEmail,
    sendRejectOfficeEmail,
    sendBlockOfficeEmail,
    sendDeleteOfficeEmail,
    sendConfirmRequestAddOfficeArrivedEmail,
    sendReceiveAddOfficeRequestEmail
} = emailsHelpers;

const officesOPerationsManagmentFunctions = require("../../respositories/offices");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "ownerFullName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getOfficesCount(req, res) {
    try {
        const result = await officesOPerationsManagmentFunctions.getOfficesCount(req.query._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllOfficesInsideThePage(req, res) {
    try {
        const filters = req.query;
        const result = await officesOPerationsManagmentFunctions.getAllOfficesInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getOfficeDetails(req, res) {
    try {
        res.json(await officesOPerationsManagmentFunctions.getOfficeDetails(req.data._id, req.params.officeId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getMainOfficeDetails(req, res) {
    try {
        res.json(await officesOPerationsManagmentFunctions.getMainOfficeDetails(req.data._id, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postNewOffice(req, res) {
    try {
        const outputImageFilePath = `assets/images/offices/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const officeInfo = Object.assign({}, req.body);
        const translations = {
            ar: await translateSentensesByAPI([officeInfo.name, officeInfo.description], "AR"),
            en: await translateSentensesByAPI([officeInfo.name, officeInfo.description], "EN"),
            de: await translateSentensesByAPI([officeInfo.name, officeInfo.description], "DE"),
            tr: await translateSentensesByAPI([officeInfo.name, officeInfo.description], "TR"),
        };
        officeInfo.name = {
            ar: translations.ar[0].text,
            en: translations.en[0].text,
            de: translations.de[0].text,
            tr: translations.tr[0].text,
        };
        officeInfo.description = {
            ar: translations.ar[1].text,
            en: translations.en[1].text,
            de: translations.de[1].text,
            tr: translations.tr[1].text,
        };
        const servicesTranslations = {
            ar: await translateSentensesByAPI(officeInfo.services, "AR"),
            en: await translateSentensesByAPI(officeInfo.services, "EN"),
            de: await translateSentensesByAPI(officeInfo.services, "DE"),
            tr: await translateSentensesByAPI(officeInfo.services, "TR"),
        };
        officeInfo.services = officeInfo.services.map((_, index) => ({
            ar: servicesTranslations.ar[index].text,
            en: servicesTranslations.en[index].text,
            de: servicesTranslations.de[index].text,
            tr: servicesTranslations.tr[index].text,
        }));
        const experiencesTranslations = {
            ar: await translateSentensesByAPI(officeInfo.experiences, "AR"),
            en: await translateSentensesByAPI(officeInfo.experiences, "EN"),
            de: await translateSentensesByAPI(officeInfo.experiences, "DE"),
            tr: await translateSentensesByAPI(officeInfo.experiences, "TR"),
        };
        officeInfo.experiences = officeInfo.experiences.map((_, index) => ({
            ar: experiencesTranslations.ar[index].text,
            en: experiencesTranslations.en[index].text,
            de: experiencesTranslations.de[index].text,
            tr: experiencesTranslations.tr[index].text,
        }));
        const result = await officesOPerationsManagmentFunctions.addNewOffice({
            ...{
                name,
                ownerFullName,
                email,
                phoneNumber,
                description,
                services,
                experiences,
                language,
            } = officeInfo,
            imagePath: outputImageFilePath
        }, req.query.language);
        if (result.error) {
            unlinkSync(outputImageFilePath);
        }
        else {
            try {
                await sendConfirmRequestAddOfficeArrivedEmail(result.data.email, result.data.language);
                await sendReceiveAddOfficeRequestEmail(process.env.BUSSINESS_EMAIL, result.data);
            } catch (err) {
                console.log(err);
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postApproveOffice(req, res) {
    try {
        const result = await officesOPerationsManagmentFunctions.approveOffice(req.data._id, req.params.officeId, req.query.password, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(await sendApproveOfficeEmail(result.data.email, req.query.password, result.data.adminId, req.params.officeId, "ar"));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putOfficeInfo(req, res) {
    try {
        const result = await officesOPerationsManagmentFunctions.updateOfficeInfo(req.data._id, req.params.officeId, req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Store Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putBlockingOffice(req, res) {
    try {
        const result = await officesOPerationsManagmentFunctions.blockingOffice(req.data._id, req.params.officeId, req.body.blockingReason, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(await sendBlockOfficeEmail(result.data.email, result.data.adminId, req.params.officeId, "ar"));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putCancelBlockingOffice(req, res) {
    try {
        const result = await officesOPerationsManagmentFunctions.cancelBlockingOffice(req.data._id, req.params.officeId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putOfficeImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/stores/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await officesOPerationsManagmentFunctions.changeOfficeImage(req.data._id, req.params.officeId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedStoreImagePath);
            res.json({
                ...result,
                data: {
                    newStoreImagePath: outputImageFilePath,
                }
            });
        } else {
            unlinkSync(outputImageFilePath);
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteOffice(req, res) {
    try {
        const result = await officesOPerationsManagmentFunctions.deleteOffice(req.data._id, req.params.officeId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Store Is Not Found !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        for (let filePath of result.data.filePaths) {
            unlinkSync(filePath);
        }
        res.json(await sendDeleteOfficeEmail(result.data.email, result.data.adminId, req.params.officeId, "ar"));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteRejectOffice(req, res) {
    try {
        const result = await officesOPerationsManagmentFunctions.rejectOffice(req.data._id, req.params.officeId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Store Is Not Found !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        for (let filePath of result.data.filePaths) {
            unlinkSync(filePath);
        }
        res.json(await sendRejectOfficeEmail(result.data.email, "ar"));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    getOfficesCount,
    getAllOfficesInsideThePage,
    getOfficeDetails,
    getMainOfficeDetails,
    postNewOffice,
    postApproveOffice,
    putOfficeInfo,
    putBlockingOffice,
    putCancelBlockingOffice,
    putOfficeImage,
    deleteOffice,
    deleteRejectOffice,
}