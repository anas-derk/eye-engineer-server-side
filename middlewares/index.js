const authMiddlewares = require("./auth");
const commonMiddlewares = require("./common");
const countriesMiddlewares = require("./countries");
const filesMiddlewares = require("./files");
const globalMiddlewares = require("./global");
const numbersMiddlewares = require("./numbers");
const sortMiddlewares = require("./sort");
const usersMiddlewares = require("./users");

module.exports = {
    authMiddlewares,
    commonMiddlewares,
    countriesMiddlewares,
    filesMiddlewares,
    globalMiddlewares,
    numbersMiddlewares,
    sortMiddlewares,
    usersMiddlewares
}