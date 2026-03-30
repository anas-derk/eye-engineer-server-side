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

linksRouter.post("/add",
    validateJWT,
    (req, res, next) => {
        const bodyData = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Link Title", fieldValue: bodyData?.title, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Link URL", fieldValue: bodyData?.url, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Geometries Ids Array", fieldValue: bodyData?.geometries, dataTypes: ["array"], isRequiredValue: true },
            bodyData?.geometries.map((geometryId, index) => ({ fieldName: `Geometry Id At Index ${index} Inside Geometries Ids Array`, fieldValue: geometryId, dataTypes: ["ObjectId"], isRequiredValue: true })),
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

linksRouter.get("/all-links-the-page",
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

linksRouter.put("/:linkId",
    validateJWT,
    (req, res, next) => {
        const bodyData = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Link Id", fieldValue: req.params.linkId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "New Link Title", fieldValue: bodyData?.title, dataTypes: ["object"], isRequiredValue: false },
            { fieldName: "Geometries Ids Array", fieldValue: bodyData?.geometries, dataTypes: ["array"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { title } = Object.assign({}, req.body);
        if (title) {
            return validateIsExistValueForFieldsAndDataTypes(["ar", "en", "de", "tr"].map((language) => (
                { fieldName: `New Link Title In ${language.toUpperCase()}`, fieldValue: title[language], dataTypes: ["string"], isRequiredValue: true }
            )), res, next);
        }
        next();
    },
    (req, res, next) => {
        const { geometries } = req.body;
        if (geometries) {
            return validateIsExistValueForFieldsAndDataTypes(
                geometries.map((geometryId, index) => (
                    { fieldName: `Geometry Id At Index ${index}`, fieldValue: geometryId, dataTypes: ["ObjectId"], isRequiredValue: true }
                ))
                , res, next);
        }
        next();
    },
    linksController.putLinkInfo
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

module.exports = linksRouter;