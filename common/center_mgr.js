
const io = require('socket.io-client');

module.exports = function () {
    return new CenterMgr();
}
var CenterMgr = function () {
    this.code = 0;

    let config = server_config.getCenterServerConfigByName(SERVER_NAME);
    console.log(`${SERVER_NAME}>>>${config.name}`);

    this.socket = io(`ws://${config.ip}:${config.port}/`);
    this.socket.emit('init', { name: SERVER_NAME, type: SERVER_TYPE, order: SERVER_ORDER });

    this.socket.on('rpc', (body) => {
        let rpc = pb.decode('server_pb.rpc', body);
        if (rpc.to != SERVER_NAME) {
            return;
        }
        this.receive(rpc);
    });

}
CenterMgr.prototype.receive = function (rpc) {
    console.log('收到来自Center-Server的消息', rpc);
    let callback = (data) => { this.rpcRet(rpc.code, rpc.from, `${rpc.route}Ret`, data) };

    let action = rpc_mgr[rpc.route];
    if (action == null) {
        console.error('未找到rpc Action', rpc);
        return;
    }
    action(rpc, callback);

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
    let body = pb.encode('server_pb.rpc', rpc);
    this.socket.emit('rpc', body);
    let retCb = (body) => {
        let rpc = pb.decode('server_pb.rpcRet', body);
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
    let body = pb.encode('server_pb.rpcRet', rpc);
    this.socket.emit('rpcRet', body);
}