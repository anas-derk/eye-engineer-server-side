const newsRouter = require("express").Router();

const newsController = require("../../controllers/news");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

newsRouter.post("/add-news",
    validateJWT,
    (req, res, next) => {
        const { content } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Content", fieldValue: content, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    newsController.postAddNews
);

newsRouter.get("/all-news", validateJWT, newsController.getAllNews);

newsRouter.put("/update-content/:id",
    validateJWT,
    (req, res, next) => {
        const { content } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "News Id", fieldValue: req.params.id, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Content", fieldValue: content, dataTypes: ["object"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { content } = req.body;
        validateIsExistValueForFieldsAndDataTypes(["ar", "en", "de", "tr"].map((language) => (
            { fieldName: `New News Content In ${language.toUpperCase()}`, fieldValue: content[language], dataTypes: ["string"], isRequiredValue: true }
        )), res, next);
    },
    newsController.putNewsContent
);

newsRouter.delete("/delete-news/:id",
    validateJWT,
    (req, res, next) => {
        console.log(req.params.id)
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "News Id", fieldValue: req.params.id, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    newsController.deleteNews
);

module.exports = newsRouter;