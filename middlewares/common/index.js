const { getResponseObject } = require("../../helpers/responses");

function validateName(name, res, nextFunc, errorMsg = "Sorry, Please Send Valid Name !!") {
    if (/^([\u0600-\u06FF\s]+|[a-zA-Z\s]+)$/.test(name)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateName,
}