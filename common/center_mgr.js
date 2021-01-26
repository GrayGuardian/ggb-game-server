
const io = require('socket.io-client');
var crc = require('crc');
module.exports = function () {
    return new CenterMgr();
}
var CenterMgr = function () {
    this.code = 0;
    this.center_list = server_config.getServerList('center-server');
    let order = Math.abs(crc.crc32(SERVER_NAME)) % this.center_list.length;
    this.config = this.center_list[order];

    this.socket = io(`ws://${this.config.url}:${this.config.port}/`);
    this.socket.emit('init', { name: SERVER_NAME });

    this.socket.on('rpc', (body) => {
        let rpc = protocol.decode('server.rpc', body);
        if (rpc.to != SERVER_NAME) {
            return;
        }
        this.receive(rpc);
    });

}
CenterMgr.prototype.receive = function (rpc) {
    console.log('收到来自Center-Server的消息', rpc);
    let callback = (data) => { this.rpcRet(rpc.code, rpc.from, `${rpc.route}Ret`, data) };

    let action = rpc_mgr.prototype[rpc.route];
    if (action == null) {
        console.error('未找到rpc Action', rpc);
        return;
    }
    action(rpc, callback);
    // //test
    // console.log(rpc.ttt.msg);
    // callback({ msg: rpc.ttt.msg })
}
CenterMgr.prototype.rpcAsync = function (to, route, data) {
    return new Promise((resolve, reject) => {
        this.rpc(to, route, data, resolve);
    });
}
CenterMgr.prototype.rpc = function (to, route, data, cb) {
    let code = this.code++;
    let rpc = { code: code, from: SERVER_NAME, to: to, route: route };
    rpc[route] = data;
    let body = protocol.encode('server.rpc', rpc);
    this.socket.emit('rpc', body);
    let retCb = (body) => {
        let rpc = protocol.decode('server.rpcRet', body);
        if (rpc.to != SERVER_NAME) {
            return;
        }
        if (rpc.code != code) return;
        if (cb != null) cb(rpc[rpc.route]);
    }
    this.socket.on('rpcRet', retCb);
}
CenterMgr.prototype.rpcRet = function (code, to, route, data) {
    let rpc = { code: code, from: SERVER_NAME, to: to, route: route };
    rpc[route] = data;
    let body = protocol.encode('server.rpcRet', rpc);
    this.socket.emit('rpcRet', body);
}