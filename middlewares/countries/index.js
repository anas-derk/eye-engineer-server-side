const { countries } = require("countries-list");

const countryList = Object.keys(countries);

function validateCountry(country, res, nextFunc, errorMsg = "Sorry, Please Send Valid Country ( kuwait Or Germany Or Turkey ) !!") {
    if (!["kuwait", "germany", "turkey"].includes(country)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateCountries(countries, res, nextFunc, errorMsgs, defaultMsg = "Sorry, Please Send Valid Country !!") {
    for (let i = 0; i < countries.length; i++) {
        if (!countryList.includes(countries[i])) {
            res.status(400).json(getResponseObject(errorMsgs[i] ? errorMsgs[i] : defaultMsg, true, {}));
            return;
        }
    }
    nextFunc();
}

module.exports = {
    validateCountry,
    validateCountries,
}