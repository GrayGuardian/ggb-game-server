const crypto = require('crypto');

var Util = function () { };

Util.token = new require('./token')();

Date.unix = function () {
    return Math.floor(Date.now() / 1000);
}
Util.md5 = function (content) {
    let md5 = crypto.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
}

module.exports = Util;