const adsRouter = require("./ads");
const adminsRouter = require("./admins");
const appearedSectionsRouter = require("./appeared_sections");
const authRouter = require("./auth");
const geometriesRouter = require("./geometries");
const globalPasswordsRouter = require("./global_passwords");
const messagesRouter = require("./messages");
const newsRouter = require("./news");
const officesRouter = require("./offices");
const propertyValuationRouter = require("./property-valuation");
const translationsRouter = require("./translations");
const usersRouter = require("./users");

const { Router } = require("express");

const routes = Router();

routes.use("/admins", adminsRouter);

routes.use("/ads", adsRouter);

routes.use("/appeared-sections", appearedSectionsRouter);

routes.use("/auth", authRouter);

routes.use("/geometries", geometriesRouter);

routes.use("/global-passwords", globalPasswordsRouter);

routes.use("/messages", messagesRouter);

routes.use("/news", newsRouter);

routes.use("/offices", officesRouter);

routes.use("/property-valuation", propertyValuationRouter);

routes.use("/translations", translationsRouter);

routes.use("/users", usersRouter);

module.exports = routes;