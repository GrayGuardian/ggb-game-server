
const protobuf = require('protobufjs');

const FILEPATH = './protocol/protocol.proto'

module.exports = function () {
    return new Protocol();
}
var Protocol = function () {
    this.init();
}
Protocol.prototype.init = function () {
    this.root = protobuf.loadSync(FILEPATH);
    this.typeMap = this.getTypeMap(this.root);
    //console.log(this.typeMap)
}

Protocol.prototype.getTypeMap = function (root, nested, namespace, map) {
    nested = nested == null ? root.nested : nested;
    namespace = namespace == null ? '' : namespace;
    map = map == null ? new Map() : map;
    for (const key in nested) {
        const value = nested[key];
        let name = namespace + value.name;
        if (value.nested == null) {
            //console.log(name, '是Type')
            map.set(name, root.lookupType(name));
        }
        else {
            //console.log(value.name, '是Namespace')
            this.getTypeMap(root, value.nested, name + '.', map);
        }
        //console.log(value, value.Type);
    }
    return map;
}

Protocol.prototype.encode = function (key, data) {
    let type = this.typeMap.get(key);
    if (type == null) {
        console.error(`Protocol Type不存在 Key:${key}`);
        return null;
    }
    try {
        console.log(type)
        console.log(data);
        
        return type.encode(data).finish();
    } catch {
        return null;
    }

}
Protocol.prototype.decode = function (key, data) {
    let type = this.typeMap.get(key);
    if (type == null) {
        console.error(`Protocol Type不存在 Key:${key}`);
        return null;
    }
    try {
        return type.decode(data);
    } catch {
        return null;
    }
}
Protocol.prototype.format = function (key, data) {
    try {
        return this.decode(key, this.encode(key, data));
    } catch {
        return null;
    }
}

