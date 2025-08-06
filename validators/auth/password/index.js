function isValidPassword(password) {
    return /^(?=.*\d)(?=.*[a-z]).{8,}$/.test(password);
}

module.exports = {
    isValidPassword
}