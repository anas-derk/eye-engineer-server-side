const geometriesRouter = require("express").Router();

const geometriesController = require("../../controllers/geometries");

const { LANGUAGES } = require("../../constants/languages");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    filesMiddlewares,
    usersMiddlewares,
    numbersMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

const {
    validateIsExistErrorInFiles,
} = filesMiddlewares;

const {
    validateUserType,
} = usersMiddlewares;

const {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
} = numbersMiddlewares;

const multer = require("multer");

geometriesRouter.post("/add",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No File Uploaded, Please Upload The File";
                return cb(null, false);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp"
            ) {
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp Files Are Allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("geometryImage"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { name, parent } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Geometry Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Geometry Parent Id", fieldValue: parent, dataTypes: ["ObjectId"], isRequiredValue: false },
        ], res, next);
    },
    geometriesController.postNewGeometry
);

geometriesRouter.get("/info/:geometryId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Geometry Id", fieldValue: req.params.geometryId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    geometriesController.getGeometryInfo
);

geometriesRouter.get("/count", validateJWT, geometriesController.getGeometriesCount);

geometriesRouter.get("/all-inside-the-page",
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
    geometriesController.getAllGeometriesInsideThePage
);

geometriesRouter.put("/:geometryId",
    validateJWT,
    (req, res, next) => {
        const { name, parent } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Geometry Id", fieldValue: req.params.geometryId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "New Geometry Name", fieldValue: name, dataTypes: ["object"], isRequiredValue: false },
            { fieldName: "Geometry Parent Id", fieldValue: parent, dataTypes: ["ObjectId", "null"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { name } = req.body;
        if (name) {
            return validateIsExistValueForFieldsAndDataTypes(LANGUAGES.map((language) => (
                { fieldName: `New Geometry Name In ${language.toUpperCase()}`, fieldValue: name[language], dataTypes: ["string"], isRequiredValue: true }
            )), res, next);
        }
        next();
    },
    geometriesController.putGeometry
);

geometriesRouter.put("/change-image/:geometryId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Geometry Id", fieldValue: req.params.geometryId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No Files Uploaded, Please Upload The Files";
                return cb(null, false);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp"
            ) {
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("geometryImage"),
    validateIsExistErrorInFiles,
    geometriesController.putGeometryImage
);

geometriesRouter.delete("/:geometryId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Geometry Id", fieldValue: req.params.geometryId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    geometriesController.deleteGeometry
);

module.exports = geometriesRouter;