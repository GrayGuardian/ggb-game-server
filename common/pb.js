

var PB = function () { }
let pbroot = require("protobufjs").Root;
PB.prototype.getMessage = function (key) {
    let keys = key.split('.')

    let json = require(`../pb/${keys[0]}.json`);
    let root = pbroot.fromJSON(json);
    let Message = root.lookupType(keys[1]);
    return Message
}

PB.prototype.encode = function (key, data) {
    if (data == null) return null;
    try {
        let Message = this.getMessage(key);
        return Message.encode(Message.create(data)).finish();
    } catch {
        return null;
    }
}
PB.prototype.decode = function (key, data) {
    if (data == null) return null;
    try {
        let Message = this.getMessage(key);

        if (typeof (data) == 'string') {
            data = typeof (data) == 'object' ? data : Buffer.from(data);
        }
        return Message.decode(data);
    } catch {
        return null;
    }
}



module.exports = function () { return new PB(); };