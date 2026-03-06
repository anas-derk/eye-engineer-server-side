const messagesRouter = require("express").Router();

const messagesController = require("../../controllers/messages");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    numbersMiddlewares,
    commonMiddlewares
} = require("../../middlewares");

const {
    validateJWT,
    validateEmail,
} = authMiddlewares;

const {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
} = numbersMiddlewares;

const {
    validateName
} = commonMiddlewares;

messagesRouter.post("/send-message",
    (req, res, next) => {
        const bodyData = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: bodyData?.name, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Content", fieldValue: bodyData?.email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Subject", fieldValue: bodyData?.subject, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Content", fieldValue: bodyData?.content, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateName(req.body.name, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    messagesController.postSendMessage
);

messagesRouter.get("/messages-count", validateJWT, messagesController.getMessagesCount);

messagesRouter.get("/all-messages-inside-the-page",
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
    messagesController.getAllMessagesInsideThePage
);

messagesRouter.delete("/delete-message/:messageId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Messsage Id", fieldValue: req.params.messageId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    messagesController.deleteMessage
);

module.exports = messagesRouter;