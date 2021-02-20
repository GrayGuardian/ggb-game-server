

var PB = {}

let pbroot = require("protobufjs").Root;
PB.encode = function (key, data) {
    let keys = key.split('.')

    let json = require(`../pb/${keys[0]}.json`);
    let root = pbroot.fromJSON(json);
    let Message = root.lookupType(keys[1]);

    return Message.encode(Message.create(data)).finish();
}
PB.decode = function (key, data) {
    let keys = key.split('.')

    let json = require(`../pb/${keys[0]}.json`);
    let root = pbroot.fromJSON(json);
    let Message = root.lookupType(keys[1]);

    if (typeof (data) == 'string') {
        data = typeof (data) == 'object' ? data : Buffer.from(data);
    }

    return Message.decode(data);
}

module.exports = PB;