require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket-2');
const app = new Koa();
const io = new IO()
io.attach(app)

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.rpc_mgr = require("./rpc/rpc_mgr")();
global.socket_mgr = require("../common/socket/socket_mgr")(io, { type: "server", validEvent: ['rpc', 'rpcRet'] });



// io.on('conn', (ctx, next) => {
//     let socket = ctx.socket;
//     let data = ctx.data;

//     let ip = socket.request.connection.remoteAddress.replace('::ffff:', '');
//     let config = server_config.getServerConfig(data.type, data.order)
//     if (config == null || config.name != data.name || config.ip != ip) {
//         //无效连接
//         console.log('[error]conn server client', '>>>', 'data:', data, "config:", config);
//         socket.disconnect();
//     }
//     else {
//         console.log('conn server client', '>>>', 'data:', data, "config:", config);
//         socket.name = data.name;
//         socket_channel.add(data.name, socket);
//     }
// })


app.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
})

