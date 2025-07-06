const adminsRepositories = require("./admins");
const authRepositories = require("./auth");
const globalPasswordsRepositories = require("./global_passwords");
const usersRepositories = require("./users");
const verificationRepositories = require("./verification_codes");

module.exports = {
    authRepositories,
    adminsRepositories,
    globalPasswordsRepositories,
    usersRepositories,
    verificationRepositories,
}