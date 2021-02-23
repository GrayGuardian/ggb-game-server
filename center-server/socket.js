

const io = require('socket.io-client');
module.exports = function (server) {
    return new SocketMgr(server);
}
var SocketMgr = function (server) {
    this.socketMap = new Map();

    let io = require('socket.io')(server);
    io.on("connection", (socket) => { this.conn(socket); });

}
SocketMgr.prototype.conn = function (socket) {
    socket.on('conn', (data) => {
        let ip = socket.request.connection.remoteAddress.replace('::ffff:', '');
        let config = server_config.getServerConfig(data.type, data.order)
        if (config == null || config.name != data.name || config.ip != ip) {
            //无效连接
            console.log('[error]conn server client', '>>>', 'data:', data, "config:", config);
            socket.disconnect();
        }
        else {
            console.log('conn server client', '>>>', 'data:', data, "config:", config);
            socket.name = data.name;
            this.socketMap.set(data.name, socket);
        }
    });
    socket.on('disconnect', () => {
        this.socketMap.forEach((value, key) => {
            if (socket == value) {
                this.socketMap.delete(key);
                console.log('disconn server client', '>>>', 'key:', key);
            }
        });

    });

    socket.on('rpc', (body) => {
        this.rpc(socket, body);
    });
    socket.on('rpcRet', (body) => {
        this.rpcRet(socket, body);
    });
}
SocketMgr.prototype.rpc = function (socket, body) {
    let rpc = pb.decode('server_pb.rpc', body);
    if (rpc == null) {
        console.log('错误的转发消息格式>>', socket.name);
        return;
    }
    console.log('消息中转', rpc);
    let t_socket = this.socketMap.get(rpc.to);

    let config = server_config.getCenterServerConfigByName(rpc.to);
    if (SERVER_NAME != config.name) {
        console.log(`不在当前center-server转发 消息中转>>> ${rpc.to}==>${config.name}`)
        t_socket = io(`ws://${config.ip}:${config.port}/`);
    }

    if (t_socket == null) {
        console.error(`未找到有效的Socket连接 Server:`, rpc.to)
        return;
    }
    t_socket.emit('rpc', body);
}
SocketMgr.prototype.rpcRet = function (socket, body) {
    let rpc = pb.decode('server_pb.rpcRet', body);
    if (rpc == null) {
        console.error('错误的转发消息格式>>', socket.name);
        return;
    }
    console.log('消息回调中转', rpc);
    let t_socket = this.socketMap.get(rpc.to);

    let config = server_config.getCenterServerConfigByName(rpc.to);
    if (SERVER_NAME != config.name) {
        console.log(`不在当前center-server转发 消息中转>>> ${rpc.to}==>${config.name}`)
        t_socket = io(`ws://${config.ip}:${config.port}/`);
    }

    if (t_socket == null) {
        console.error(`未找到有效的Socket连接 Server:`, rpc.to)
        return;
    }
    t_socket.emit('rpcRet', body);
}
