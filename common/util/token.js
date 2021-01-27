const jwt = require('jsonwebtoken');
const SecretKey = '851a028465fc4f62bc4f8451347c9eff';
var Token = function () { };
Token.prototype.encrypt = function (data, time) {
    time = time == null ? '1d' : time;
    return jwt.sign(data, SecretKey, { expiresIn: time })
}
Token.prototype.decrypt = function (token) {
    try {
        let data = jwt.verify(token, SecretKey);
        if (data.exp < Date.unix()) {
            //Token过期
            return;
        }
        return data;
    } catch (e) {
        return null
    }
}
module.exports = function (prototype) {
    return new Token();
};