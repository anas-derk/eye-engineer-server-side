const { getResponseObject } = require("../../helpers/responses");

function validateSortMethod(sortBy, res, nextFunc, errorMsg = "Sorry, Please Send Valid Sort Method ( 'postOfDate' Or 'price' or 'numberOfOrders' ) !!") {
    if (!["postOfDate", "price", "numberOfOrders"].includes(sortBy)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateSortType(sortType, res, nextFunc, errorMsg = "Sorry, Please Send Valid Sort Type ( '-1' For Descending Sort Or '1' For Ascending Sort ) !!") {
    if (!["1", "-1"].includes(sortType)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateSortMethod,
    validateSortType
}