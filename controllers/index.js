const adminsController = require("./admins");
const authController = require("./auth");
const globalPasswordsController = require("./global_passwords");
const usersController = require("./users");

module.exports = {
    adminsController,
    globalPasswordsController,
    usersController,
    authController
}