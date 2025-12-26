const officesRouter = require("express").Router();

const officesController = require("../../controllers/offices");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    commonMiddlewares,
    filesMiddlewares,
    usersMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
    validatePassword,
    validateEmail
} = authMiddlewares;

const {
    validateName
} = commonMiddlewares;

const {
    validateIsExistErrorInFiles
} = filesMiddlewares;

const {
    validateUserType
} = usersMiddlewares;

const multer = require("multer");

officesRouter.get("/offices-count", validateJWT, officesController.getOfficesCount);

officesRouter.get("/all-offices-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, _id } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Office Id", fieldValue: _id, dataTypes: ["ObjectId"], isRequiredValue: false },
        ], res, next);
    },
    officesController.getAllOfficesInsideThePage
);

officesRouter.get("/office-details/:officeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Office Id", fieldValue: req.params.officeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    officesController.getOfficeDetails
);

officesRouter.get("/main-office-details", validateJWT, officesController.getMainOfficeDetails);

officesRouter.post("/add-office",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("officeImg"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { name, ownerFullName, email, phoneNumber, description, services, experiences, language } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Owner Full Name", fieldValue: ownerFullName, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Owner Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Phone Number", fieldValue: phoneNumber, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Description", fieldValue: description, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Services", fieldValue: services, dataTypes: ["array"], isRequiredValue: true },
            { fieldName: "Experiences", fieldValue: experiences, dataTypes: ["array"], isRequiredValue: true },
            { fieldName: "Language", fieldValue: language, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateName(Object.assign({}, req.body).ownerFullName, res, next),
    (req, res, next) => validateEmail(Object.assign({}, req.body).email, res, next),
    (req, res, next) => {
        const { services } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes(
            services.map((service, index) => ([
                { fieldName: `Service In Index: ${index + 1}`, fieldValue: service, dataTypes: ["string"], isRequiredValue: true },
            ]))
            , res, next);
    },
    (req, res, next) => {
        const { experiences } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes(
            experiences.map((experience, index) => ([
                { fieldName: `Experience In Index: ${index + 1}`, fieldValue: experience, dataTypes: ["string"], isRequiredValue: true },
            ]))
            , res, next);
    },
    officesController.postNewOffice
);

officesRouter.post("/approve-office/:officeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Office Id", fieldValue: req.params.officeId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Password", fieldValue: req.query.password, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validatePassword(req.query.password, res, next),
    officesController.postApproveOffice
);

officesRouter.put("/update-office-info/:officeId", validateJWT, officesController.putOfficeInfo);

officesRouter.put("/blocking-office/:officeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Office Id", fieldValue: req.params.officeId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Blocking Reason", fieldValue: req.query.blockingReason, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    officesController.putBlockingOffice
);

officesRouter.put("/cancel-blocking/:officeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Office Id", fieldValue: req.params.officeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    officesController.putCancelBlockingOffice
);

officesRouter.put("/change-office-image/:officeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Office Id", fieldValue: req.params.officeId, dataTypes: ["ObjectId"], isRequiredValue: true },
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
    }).single("officeImage"),
    validateIsExistErrorInFiles,
    officesController.putOfficeImage
);

officesRouter.delete("/delete-office/:officeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Office Id", fieldValue: req.params.officeId, dataTypes: ["ObjectId"], isRequiredValue: false },
        ], res, next);
    },
    officesController.deleteOffice
);

officesRouter.delete("/reject-office/:officeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Office Id", fieldValue: req.params.officeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    officesController.deleteRejectOffice
);

module.exports = officesRouter;