const translationsRouter = require("express").Router();

const translationsController = require("../../controllers/translations");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
} = require("../../middlewares");

const { validateLanguage } = require("../../middlewares/global");

const {
    validateJWT,
} = authMiddlewares;

translationsRouter.post("/translate",
    validateJWT,
    (req, res, next) => {
        const { text, language } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Text", fieldValue: text, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Language", fieldValue: language, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateLanguage(req.body.language, res, next, "Sorry, Please Send Valid Target Language !!"),
    translationsController.postTranslate
);

module.exports = translationsRouter;