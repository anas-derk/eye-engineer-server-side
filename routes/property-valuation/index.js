const propertyValuationRouter = require("express").Router();

const propertyValuationController = require("../../controllers/property_valuation");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    numbersMiddlewares,
    commonMiddlewares
} = require("../../middlewares");

const {
    validateJWT,
    validateEmail,
    validateMobilePhone
} = authMiddlewares;

const {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
} = numbersMiddlewares;

const {
    validateName
} = commonMiddlewares;

propertyValuationRouter.post("/create-order",
    (req, res, next) => {
        const bodyData = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Owner", fieldValue: bodyData?.owner, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Full Name", fieldValue: bodyData?.fullName, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Representative Full Name", fieldValue: bodyData?.representativeFullName, dataTypes: ["string"], isRequiredValue: bodyData?.owner === "representative" },
            { fieldName: "Legal Entity", fieldValue: bodyData?.legalEntity, dataTypes: ["string"], isRequiredValue: bodyData?.owner === "representative" },
            { fieldName: "City", fieldValue: bodyData?.city, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Phone Number", fieldValue: bodyData?.phoneNumber, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Whatsapp Number", fieldValue: bodyData?.whatsappNumber, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Email", fieldValue: bodyData?.email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Location", fieldValue: bodyData?.location, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Purpose", fieldValue: bodyData?.purpose, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateName(req.body.fullName, res, next),
    (req, res, next) => {
        const representativeFullName = req.body?.representativeFullName;
        if (representativeFullName) {
            return validateName(representativeFullName, res, next);
        }
        next();
    },
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validateMobilePhone(req.body.mobilePhone, undefined, res, next),
    (req, res, next) => {
        const whatsappNumber = req.body?.whatsappNumber;
        if (whatsappNumber) {
            return validateMobilePhone(whatsappNumber, res, next);
        }
        next();
    },
    propertyValuationController.postCreateOrder
);

propertyValuationRouter.get("/orders-count", validateJWT, propertyValuationController.getOrdersCount);

propertyValuationRouter.get("/all-orders-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, _id, name, email } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Id", fieldValue: _id, dataTypes: ["ObjectId"], isRequiredValue: false },
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { name } = req.query;
        if (name) {
            return validateName(name, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { email } = req.query;
        if (email) {
            return validateEmail(email, res, next);
        }
        next();
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    propertyValuationController.getAllOrdersInsideThePage
);

propertyValuationRouter.delete("/delete-order/:orderId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    propertyValuationController.deleteOrder
);

module.exports = propertyValuationRouter;