
const protobuf = require('protobufjs');

const config = {
    'server': {
        'file': './protocol/server.proto',
        'types': ['rpc', 'rpcRet']
    },
};
module.exports = function () {
    return new Protocol();
}
var Protocol = function () {
    this.init();
}
Protocol.prototype.init = function () {
    this.typeMap = new Map();
    for (const key in config) {
        const value = config[key];
        let root = protobuf.loadSync(value.file);
        value.types.forEach(type => {
            let t = root.lookupType(type);
            this.typeMap.set(`${key}.${type}`, t);
        });
    }
}
Protocol.prototype.encode = function (key, data) {
    let type = this.typeMap.get(key);
    if (type == null) {
        console.error(`Protocol Type不存在 Key:${key}`);
        return;
    }
    return type.encode(data).finish();
}
Protocol.prototype.decode = function (key, data) {
    let type = this.typeMap.get(key);
    if (type == null) {
        console.error(`Protocol Type不存在 Key:${key}`);
        return;
    }
    return type.decode(data);
}
