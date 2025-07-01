const adminsRouter = require("./admins");
const globalPasswordsRouter = require("./global_passwords");
const usersRouter = require("./users");

const { Router } = require("express");

const routes = Router();

routes.use("/admins", adminsRouter);

routes.use("/global-passwords", globalPasswordsRouter);

routes.use("/users", usersRouter);

module.exports = routes;