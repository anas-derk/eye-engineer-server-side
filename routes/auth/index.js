const authRouter = require("express").Router();

const authController = require("../../controllers/auth");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    commonMiddlewares,
    usersMiddlewares,
    globalMiddlewares,
} = require("../../middlewares");

const {
    validateEmail,
    validatePassword,
    validateCode,
    validateTypeOfUseForCode,
} = authMiddlewares;

const {
    validateName
} = commonMiddlewares;

const {
    validateUserType
} = usersMiddlewares;

const {
    validateLanguage,
} = globalMiddlewares;

authRouter.post("/create-new-user",
    (req, res, next) => {
        const { name, email, password, language } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Language", fieldValue: language, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateName(req.body.name, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validatePassword(req.body.password, res, next),
    (req, res, next) => validateLanguage(req.body.language, res, next),
    authController.postCreateNewUser
);

authRouter.post("/send-code",
    (req, res, next) => {
        const { email, typeOfUse, userType } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Type Of Use", fieldValue: typeOfUse, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateUserType(req.body.userType, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validateTypeOfUseForCode(req.body.typeOfUse, res, next),
    authController.postAccountVerificationCode
);

authRouter.post("/login",
    (req, res, next) => {
        const { userType, email, password } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateUserType(req.body.userType, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validatePassword(req.body.password, res, next),
    authController.postLogin
);

authRouter.post("/login-with-google",
    (req, res, next) => {
        const { userType, email, name } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateUserType(req.body.userType ?? "user", res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validateName(req.body.name, res, next),
    authController.postLoginWithGoogle
);

authRouter.post("/forget-password",
    (req, res, next) => {
        const { email, userType } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateUserType(req.body.userType, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    authController.postForgetPassword
);

authRouter.put("/update-verification-status",
    (req, res, next) => {
        const { email, code } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Code", fieldValue: code, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.body.email, res, next),
    authController.putVerificationStatus
);

authRouter.put("/reset-password",
    (req, res, next) => {
        const { userType, email, code, newPassword } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Code", fieldValue: code, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "New Password", fieldValue: newPassword, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateUserType(req.body.userType, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    (req, res, next) => validateCode(req.body.code, res, next),
    (req, res, next) => validatePassword(req.body.newPassword, res, next),
    authController.putResetPassword
);

module.exports = authRouter;