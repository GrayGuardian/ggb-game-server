require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket');
const app = new Koa();
const io = new IO()

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.center_mgr = require('../common/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr')();
global.logic_mgr = require('./logic/logic_mgr')();


io.attach(app)
io.on('connection', (ctx, next) => {
    //ctx.socket.disconnect();
    console.log('connection');
})
io.on('disconnect', (ctx, next) => {
    console.log('disconn')
})
io.on('rpc', (ctx, next) => {
    console.log('rpc>>>', pb.decode("socket_pb.c2s", ctx.data))
})

app.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
})

