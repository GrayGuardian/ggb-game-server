require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket-2');
const app = new Koa();
const io = new IO()
io.attach(app)

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);


app.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
})

global.rpc_mgr = require("./rpc/rpc_mgr")();
global.socket_mgr = require("../common/socket/socket_mgr")(io, { type: "server", validEvent: ['rpc', 'rpcRet'] });


io.use(async (ctx, next) => {
    console.log("io user0")
    await next();
});