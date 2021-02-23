

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
    socket.on('init', (data) => {
        let ip = socket.request.connection.remoteAddress.replace('::ffff:', '');
        let config = server_config.getServerConfig(data.type, data.order)
        if (config == null || config.name != data.name || config.ip != ip) {
            //无效连接
            console.log('无效连接>>>', data);
            socket.disconnect();
        }
        else {
            console.log('Server连接>>>', data);
            this.socketMap.set(data.name, socket);
        }
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
    let rpc = pb.decode('server_pb.rpc', body);
    console.log('消息中转', rpc);
    let socket = this.socketMap.get(rpc.to);

    let config = server_config.getCenterServerConfigByName(rpc.to);
    if (SERVER_NAME != config.name) {
        console.log(`不在当前center-server转发 消息中转>>> ${rpc.to}==>${config.name}`)
        socket = io(`ws://${config.ip}:${config.port}/`);
    }

    if (socket == null) {
        console.error(`未找到有效的Socket连接 Server: ${server} `)
        return;
    }
    socket.emit('rpc', body);
}
SocketMgr.prototype.rpcRet = function (body) {
    let rpc = pb.decode('server_pb.rpcRet', body);
    console.log('消息回调中转', rpc);
    let socket = this.socketMap.get(rpc.to);

    let config = server_config.getCenterServerConfigByName(rpc.to);
    if (SERVER_NAME != config.name) {
        console.log(`不在当前center-server转发 消息中转>>> ${rpc.to}==>${config.name}`)
        socket = io(`ws://${config.ip}:${config.port}/`);
    }

    if (socket == null) {
        console.error(`未找到有效的Socket连接 Server: ${server} `)
        return;
    }
    socket.emit('rpcRet', body);
}
