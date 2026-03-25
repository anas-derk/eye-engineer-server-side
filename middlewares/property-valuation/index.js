const { OWNERS } = require("../../constants/property-valuation");

const { getResponseObject } = require("../../helpers/responses");

function validatePropertyValuationOrderOwner(owner, res, nextFunc, errorMsg = "Sorry, Please Send Valid Owner Type !!") {
    if (!OWNERS.includes(owner)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validatePropertyValuationOrderOwner,
}