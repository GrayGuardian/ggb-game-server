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

Util.toJson = function (object, name) {
    var result = "";
    function serializeInternal(o, path) {
        for (p in o) {
            var value = o[p];
            if (value == null) {
                result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "null;";
            }
            else {
                if (typeof value != "object") {
                    if (typeof value == "string") {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "] = " + "\"" + value.replace(/\"/g, "\\\"") + "\"" + ";";
                    } else {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "] = " + value + ";";
                    }
                }
                else {
                    if (value instanceof Array) {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "new Array();";
                        serializeInternal(value, path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]");
                    } else {
                        result += "\n" + path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]" + "=" + "new Object();";
                        serializeInternal(value, path + "[" + (isNaN(p) ? "\"" + p + "\"" : p) + "]");
                    }
                }
            }
        }
    }
    serializeInternal(object, name);
    return result;
}

module.exports = Util;