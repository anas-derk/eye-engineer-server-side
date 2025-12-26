const authRouter = require("./auth");
const appearedSectionsRouter = require("./appeared_sections");
const adminsRouter = require("./admins");
const globalPasswordsRouter = require("./global_passwords");
const newsRouter = require("./news");
const officesRouter = require("./offices");
const translationsRouter = require("./translations");
const usersRouter = require("./users");

const { Router } = require("express");

const routes = Router();

routes.use("/admins", adminsRouter);

routes.use("/appeared-sections", appearedSectionsRouter);

routes.use("/auth", authRouter);

routes.use("/global-passwords", globalPasswordsRouter);

routes.use("/news", newsRouter);

routes.use("/offices", officesRouter);

routes.use("/translations", translationsRouter);

routes.use("/users", usersRouter);

module.exports = routes;