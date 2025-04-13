const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const { validateJWT, validateEmail, validatePassword, validateUserType, validateLanguage, validateTypeOfUseForCode, validateName, validateIsExistErrorInFiles, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat } = require("../middlewares/global.middlewares");

const multer = require("multer");

usersRouter.get("/login",
    (req, res, next) => {
        const { email, password } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    (req, res, next) => validatePassword(req.query.password, res, next),
    usersController.login
);

usersRouter.get("/login-with-google",
    (req, res, next) => {
        const { email, name } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Name", fieldValue: name, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    usersController.loginWithGoogle
);

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
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    usersController.getAllUsersInsideThePage
);

usersRouter.get("/forget-password",
    (req, res, next) => {
        const { email, userType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "User Type", fieldValue: userType, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    (req, res, next) => validateUserType(req.query.userType, res, next),
    usersController.getForgetPassword
);

usersRouter.post("/create-new-user",
    (req, res, next) => {
        const { name, email, password, language } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: name, dataType: "string", isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
            { fieldName: "Language", fieldValue: language, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateName(req.body.name, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validatePassword(req.body.password, res, next),
    (req, res, next) => validateLanguage(req.body.language, res, next),
    usersController.createNewUser
);

usersRouter.post("/send-account-verification-code",
    (req, res, next) => {
        const { email, typeOfUse, userType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataType: "string", isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Type Of Use", fieldValue: typeOfUse, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateUserType(req.query.userType, res, next),
    (req, res, next) => validateEmail(req.query.email, res, next),
    (req, res, next) => validateTypeOfUseForCode(req.query.typeOfUse, res, next),
    usersController.postAccountVerificationCode
);

usersRouter.put("/update-user-info",
    validateJWT,
    (req, res, next) => {
        const { firstName, lastName, previewName, email, password, newPassword } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "First Name", fieldValue: firstName, dataType: "string", isRequiredValue: false },
            { fieldName: "Last Name", fieldValue: lastName, dataType: "string", isRequiredValue: false },
            { fieldName: "Preview Name", fieldValue: previewName, dataType: "string", isRequiredValue: false },
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: false },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: newPassword ? true : false },
            { fieldName: "New Password", fieldValue: newPassword, dataType: "string", isRequiredValue: password ? true : false },
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

usersRouter.put("/update-verification-status",
    (req, res, next) => {
        const { email, code } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Code", fieldValue: code, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    usersController.putVerificationStatus
);

usersRouter.put("/reset-password",
    (req, res, next) => {
        const { email, userType, code, newPassword } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "User Type", fieldValue: userType, dataType: "string", isRequiredValue: true },
            { fieldName: "Code", fieldValue: code, dataType: "string", isRequiredValue: true },
            { fieldName: "New Password", fieldValue: newPassword, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    (req, res, next) => validateUserType(req.query.userType, res, next),
    (req, res, next) => validatePassword(req.query.newPassword, res, next),
    usersController.putResetPassword
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

usersRouter.delete("/:userId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Id", fieldValue: req.params.userId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    usersController.deleteUser
);

module.exports = usersRouter;