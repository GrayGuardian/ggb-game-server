const jwt = require('jsonwebtoken');
var Token = function () { };

Token.prototype.encrypt = function (data, time) {
    return jwt.sign(data, 'token', { expiresIn: time })
}
Token.prototype.decrypt = function (token) {
    try {
        let data = jwt.verify(token, 'token');
        return data;
    } catch (e) {
        return null
    }
}
module.exports = function (prototype) {
    return new Token();
};