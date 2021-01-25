
const io = require('socket.io-client');
var crc = require('crc');
module.exports = function () {
    return new CenterMgr();
}
var CenterMgr = function () {
    this.center_list = server_config.getServerList('center-server');
    let order = Math.abs(crc.crc32(SERVER_NAME)) % this.center_list.length;
    this.config = this.center_list[order];

    this.socket = io(`ws://${this.config.url}:${this.config.port}/`);
    this.socket.emit('init', { name: SERVER_NAME });

    this.socket.on('send', (rpc) => {
        let body = protocol.decode('server.rpc', rpc);
        if (body.to != SERVER_NAME) {
            console.error('转发错误');
            return;
        }
        this.receive(body);
    });
}
CenterMgr.prototype.receive = function (rpc) {
    console.log('收到来自Center-Server的消息', rpc);
}
CenterMgr.prototype.send = function (to, route, data) {
    let body = { from: SERVER_NAME, to: to, route: route };
    body[route] = data;
    let rpc = protocol.encode('server.rpc', body);
    this.socket.emit('send', rpc);
}