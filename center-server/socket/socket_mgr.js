
module.exports = function (server) {
    return new SocketMgr(server);
}
var SocketMgr = function (server) {
    this.socketMap = new Map();
    this.io = require('socket.io')(server);
    this.io.on("connection", (socket) => { this.conn(socket); });
}
SocketMgr.prototype.conn = function (socket) {
    socket.on('init', (data) => {
        console.log('Server连接', data);
        this.socketMap.set(data.name, socket);
    });
    socket.on('disconnect', () => {
        this.socketMap.forEach((value, key) => {
            if (socket == value) {
                this.socketMap.delete(key);
                console.log('Server断开', key);
            }
        });

    });

    socket.on('rpc', (body) => {
        this.rpc(body);
    });
    socket.on('rpcRet', (body) => {
        this.rpcRet(body);
    });
}
SocketMgr.prototype.rpc = function (body) {
    let rpc = protocol.decode('server.rpc', body);
    console.log('消息中转', rpc);
    let socket = this.socketMap.get(rpc.to);
    if (socket == null) {
        console.error(`未找到有效的Socket连接 Server:${server}`)
        return;
    }
    socket.emit('rpc', body);
}
SocketMgr.prototype.rpcRet = function (body) {
    let rpc = protocol.decode('server.rpcRet', body);
    console.log('消息回调中转', rpc);
    let socket = this.socketMap.get(rpc.to);
    if (socket == null) {
        console.error(`未找到有效的Socket连接 Server:${server}`)
        return;
    }
    socket.emit('rpcRet', body);
}
