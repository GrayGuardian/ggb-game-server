
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

    socket.on('send', (rpc) => {
        this.receive(rpc);
    });
}
SocketMgr.prototype.receive = function (rpc) {
    let body = protocol.decode('server.rpc', rpc);
    console.log('消息中转', body);
    let socket = this.socketMap.get(body.to);
    if (socket == null) {
        console.error(`未找到有效的Socket连接 Server:${server}`)
        return;
    }
    socket.emit('send', rpc);
}
