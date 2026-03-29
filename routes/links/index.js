const linksRouter = require("express").Router();

const linksController = require("../../controllers/links");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    numbersMiddlewares,
    usersMiddlewares
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

const {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
} = numbersMiddlewares;

const {
    validateUserType,
} = usersMiddlewares;

linksRouter.post("/add-link",
    validateJWT,
    validateIsExistErrorInFiles,
    validateRealFilesType,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Link Title", fieldValue: (Object.assign({}, req.body)).title, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    linksController.postNewLink
);

linksRouter.get("/links-count",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Geometry Id", fieldValue: req.query.geometryId, dataTypes: ["ObjectId"], isRequiredValue: false },
        ], res, next);
    },
    linksController.getLinksCount
);

linksRouter.get("/all-links-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, userType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    (req, res, next) => validateUserType(req.query.userType, res, next),
    linksController.getAllLinksInsideThePage
);

linksRouter.delete("/:linkId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Link Id", fieldValue: req.params.linkId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    linksController.deleteLink
);

linksRouter.put("/:linkId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Link Id", fieldValue: req.params.linkId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "New Link Title", fieldValue: req.body.title, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    linksController.putLinkInfo
);

module.exports = linksRouter;