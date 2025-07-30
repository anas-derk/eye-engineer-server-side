const adminsRepositories = require("./admins");
const authRepositories = require("./auth");
const globalPasswordsRepositories = require("./global_passwords");
const newsRepositories = require("./news");
const usersRepositories = require("./users");
const verificationRepositories = require("./verification_codes");

module.exports = {
    authRepositories,
    adminsRepositories,
    globalPasswordsRepositories,
    newsRepositories,
    usersRepositories,
    verificationRepositories,
}