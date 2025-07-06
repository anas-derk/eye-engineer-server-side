const usersRouter = require("express").Router();

const usersController = require("../../controllers/users");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    numbersMiddlewares,
    filesMiddlewares,
    usersMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
    validateEmail,
    validatePassword,
} = authMiddlewares;

const {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
} = numbersMiddlewares;

const {
    validateIsExistErrorInFiles
} = filesMiddlewares;

const {
    validateUserType
} = usersMiddlewares;

const multer = require("multer");

usersRouter.get("/user-info",
    validateJWT,
    usersController.getUserInfo
);

usersRouter.get("/users-count", validateJWT, usersController.getUsersCount);

usersRouter.get("/all-users-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    usersController.getAllUsersInsideThePage
);

usersRouter.put("/update-user-info",
    validateJWT,
    (req, res, next) => {
        const { firstName, lastName, previewName, email, password, newPassword } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "First Name", fieldValue: firstName, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Last Name", fieldValue: lastName, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Preview Name", fieldValue: previewName, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Password", fieldValue: password, dataTypes: ["string"], isRequiredValue: newPassword ? true : false },
            { fieldName: "New Password", fieldValue: newPassword, dataTypes: ["string"], isRequiredValue: password ? true : false },
        ], res, next);
    },
    (req, res, next) => {
        const { email } = req.body;
        if (email) {
            validateEmail(email, res, next);
            return;
        }
        next();
    },
    (req, res, next) => {
        const { password } = req.body;
        if (password) {
            validatePassword(password, res, next);
            return;
        }
        next();
    },
    usersController.putUserInfo
);

usersRouter.put("/change-user-image",
    validateJWT,
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
    }).single("userImage"),
    validateIsExistErrorInFiles,
    usersController.putUserImage
);

usersRouter.delete("/delete-user",
    validateJWT,
    (req, res, next) => {
        const { userType, userId } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "User Id", fieldValue: userId, dataTypes: ["ObjectId"], isRequiredValue: userType === "admin" },
        ], res, next);
    },
    (req, res, next) => {
        const { userType } = req.query;
        if (userType) {
            return validateUserType(userType, res, next);
        }
        next();
    },
    usersController.deleteUser
);

module.exports = usersRouter;