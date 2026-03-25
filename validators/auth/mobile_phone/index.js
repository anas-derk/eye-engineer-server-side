const { parsePhoneNumberFromString } = require("libphonenumber-js");

function isValidMobilePhone(mobilePhone, country) {
    const phoneNumber = parsePhoneNumberFromString(mobilePhone, country);
    if (phoneNumber) {
        if (country) {
            if (phoneNumber.country !== country) {
                return false;
            }
        }
        return phoneNumber.isValid();
    }
    return false;
}

module.exports = {
    isValidMobilePhone,
}