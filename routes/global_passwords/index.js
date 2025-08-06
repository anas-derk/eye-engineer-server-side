const globalPasswordRouter = require("express").Router();

const globalPasswordsController = require("../../controllers/global_passwords");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const { validateJWT, validateEmail, validatePassword } = require("../../middlewares/auth");

globalPasswordRouter.put("/change-bussiness-email-password",
    validateJWT,
    (req, res, next) => {
        const { email, password, newPassword } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Bussiness Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Bussiness Password", fieldValue: password, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "New Bussiness Password", fieldValue: newPassword, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validatePassword(req.body.password, res, next),
    (req, res, next) => validatePassword(req.body.newPassword, res, next),
    globalPasswordsController.putChangeBussinessEmailPassword
);

module.exports = globalPasswordRouter;