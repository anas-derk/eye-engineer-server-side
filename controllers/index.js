const adminsController = require("./admins");
const authController = require("./auth");
const globalPasswordsController = require("./global_passwords");
const newsController = require("./news");
const usersController = require("./users");

module.exports = {
    adminsController,
    globalPasswordsController,
    newsController,
    usersController,
    authController
}