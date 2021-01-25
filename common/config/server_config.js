let server = require('./server');

module.exports = function (type, order) {
    return new ServerConfig(type, order);
}
var ServerConfig = function (type, order) {
    this.config_list = server[PRO_ENV];
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

