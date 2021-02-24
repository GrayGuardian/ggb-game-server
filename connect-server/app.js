require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket');
const app = new Koa();
const io = new IO()
io.attach(app)

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);


app.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
})

global.center_mgr = require('../common/socket/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr')();
global.logic_mgr = require('./logic/logic_mgr')();

global.socket_mgr = require("./socket/socket_mgr")();
require("../common/socket/socket")(io, {
    type: "socket",
    validEvent: ['c2s'],
    errorEvent: (ctx, code) => {
        console.log('出现错误:', genErrorMsg(code));
    }
});
