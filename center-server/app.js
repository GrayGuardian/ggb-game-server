require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket-2');
const IOClient = require('socket.io-client');
const app = new Koa();
const io = new IO()

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.socket_channel = require("../common/socket/socket_channel")(io);

io.attach(app)
io.on('conn', (ctx, next) => {
    let socket = ctx.socket;
    let data = ctx.data;
    
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
        socket_channel.add(data.name,socket);
    }
})
io.on('disconnect', (ctx, next) => {
    let socket = ctx.socket;
    socket_channel.del(socket.name, socket);
})
io.on('rpc', (ctx, next) => {
    let socket = ctx.socket;
    let body = ctx.data;

    let rpc = pb.decode('server_pb.rpc', body);
    if (rpc == null) {
        console.log('错误的转发消息格式>>', socket.name);
        return;
    }
    console.log('消息中转', rpc);
    if (socket_channel.exist(rpc.to)){
        socket_channel.emit(rpc.to, 'rpc', body)
    }
    else{
        let config = server_config.getCenterServerConfigByName(rpc.to);
        console.log(`不在当前center-server转发 消息中转>>> ${rpc.to}==>${config.name}`)
        let t_socket = IOClient(`ws://${config.ip}:${config.port}/`);
        if (t_socket == null) {
            console.error(`未找到有效的Socket连接 Server:`, rpc.to)
            return;
        }
        t_socket.emit('rpc', body);
    }
})
io.on('rpcRet', (ctx, next) => {
    let socket = ctx.socket;
    let body = ctx.data;

    let rpc = pb.decode('server_pb.rpcRet', body);
    if (rpc == null) {
        console.error('错误的转发消息格式>>', socket.name);
        return;
    }
    console.log('消息回调中转', rpc);
    if (socket_channel.exist(rpc.to)) {
        socket_channel.emit(rpc.to, 'rpcRet', body)
    }
    else {
        let config = server_config.getCenterServerConfigByName(rpc.to);
        console.log(`不在当前center-server转发 消息中转>>> ${rpc.to}==>${config.name}`)
        let t_socket = IOClient(`ws://${config.ip}:${config.port}/`);
        if (t_socket == null) {
            console.error(`未找到有效的Socket连接 Server:`, rpc.to)
            return;
        }
        t_socket.emit('rpcRet', body);
    }
})

app.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
})
