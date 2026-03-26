const adsMiddlewares = require("./ads");
const authMiddlewares = require("./auth");
const commonMiddlewares = require("./common");
const filesMiddlewares = require("./files");
const globalMiddlewares = require("./global");
const numbersMiddlewares = require("./numbers");
const propertyValuationMiddlewares = require("./property-valuation");
const sortMiddlewares = require("./sort");
const usersMiddlewares = require("./users");

module.exports = {
    adsMiddlewares,
    authMiddlewares,
    commonMiddlewares,
    filesMiddlewares,
    globalMiddlewares,
    numbersMiddlewares,
    propertyValuationMiddlewares,
    sortMiddlewares,
    usersMiddlewares
}