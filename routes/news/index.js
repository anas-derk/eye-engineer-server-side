const newsRouter = require("express").Router();

const newsController = require("../../controllers/news");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

newsRouter.post("/add-new-news",
    validateJWT,
    (req, res, next) => {
        const { content } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Content", fieldValue: content, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    newsController.postAddNewNews
);

newsRouter.get("/all-news", validateJWT, newsController.getAllNews);

newsRouter.put("/update-news-info",
    validateJWT,
    (req, res, next) => {
        const { content } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Content", fieldValue: content, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    newsController.putNewsInfo
);

newsRouter.delete("/delete-news",
    validateJWT,
    (req, res, next) => {
        const { userId } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "News Id", fieldValue: userId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    newsController.deleteNews
);

module.exports = newsRouter;