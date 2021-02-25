const configs = require('./server');
const crc = require('crc');
module.exports = function (type, order) {
    return new ServerConfig(type, order);
}
var ServerConfig = function (type, order) {
    this.config_list = configs[PRO_ENV];
    for (const key in this.config_list) {
        let list = this.config_list[key];
        list.forEach((config, index) => {
            config.name = `${key}${index}`
        });
    }

    this.config = this.getServerConfig(type, order);
}
ServerConfig.prototype.getServerConfig = function (type, order) {
    order = order == null ? 0 : order;
    let list = this.getServerList(type);
    if (list == null) return;
    if (list.length <= order) {
        console.error(`服务器配置超出长度 Type:${type} Order:${order}`)
        return;
    }
    return list[order];
}
ServerConfig.prototype.getServerList = function (type) {
    let list = this.config_list[type];
    if (list == null) {
        console.error(`未找到服务器配置 Type:${type}`);
        return;
    }
    return list;
}
//根据服务器名字获取对应的center-server配置
ServerConfig.prototype.getCenterServerConfigByName = function (name) {
    let list = this.getServerList('center-server');
    let order = Math.abs(crc.crc32(name)) % list.length;
    let config = list[order];
    return config;
}
//根据区服ID获取对应的game-server配置
ServerConfig.prototype.getGameServerConfigByAID = function (aid) {
    let list = this.getServerList('game-server');
    let order = Math.abs(crc.crc32(aid.toString())) % list.length;
    let config = list[order];
    return config;
}