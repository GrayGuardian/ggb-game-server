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
Util.toUpperCase = function (str, sep) {
    let arr = str.split(sep);
    arr.forEach((str, index) => {
        arr[index] = str[0].toUpperCase() + str.substr(1);
    });
    return arr.join(sep);
}

module.exports = Util;