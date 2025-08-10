const appearedSectionsRouter = require("express").Router();

const appearedSectionsController = require("../../controllers/appeared_sections");

const {
    authMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

appearedSectionsRouter.get("/all-sections", appearedSectionsController.getAllSections);

appearedSectionsRouter.put("/update-sections-status", validateJWT, appearedSectionsController.putSectionsStatus);

module.exports = appearedSectionsRouter;