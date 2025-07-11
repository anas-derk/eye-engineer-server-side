const globalPasswordRouter = require("express").Router();

const globalPasswordsController = require("../../controllers/global_passwords");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const { validateJWT, validateEmail, validatePassword } = require("../../middlewares/auth");

globalPasswordRouter.put("/change-bussiness-email-password",
    validateJWT,
    (req, res, next) => {
        const { email, password, newPassword } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Bussiness Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Bussiness Password", fieldValue: password, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "New Bussiness Password", fieldValue: newPassword, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    (req, res, next) => validatePassword(req.query.password, res, next),
    (req, res, next) => validatePassword(req.query.newPassword, res, next),
    globalPasswordsController.putChangeBussinessEmailPassword
);

module.exports = globalPasswordRouter;