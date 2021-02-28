require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket');
const app = new Koa();
const io = new IO()
io.attach(app)

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

io.use(async (ctx, next) => {
    ctx.method = {};
    //错误码相关
    ctx.method.kick = function (code) {
        ctx.socket.kick(code);
    }
    //错误码相关
    ctx.method.genError = function (code) {
        ctx.socket.genError(code);
    }
    //返回函数
    ctx.method.callback = function (data) {
        let router = `${ctx.router}Ret`;
        ctx.socket.send(router, data)
    }
    await next();
});

app.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
})

global.center_mgr = require('../common/socket/center_mgr')();
global.rpc_router = require('./rpc/rpc_router')();
global.logic_mgr = require('./logic/logic_mgr')();

global.heatbeat_mgr = require("./socket/heatbeat_mgr")();
global.socket_mgr = require("./socket/socket_mgr")();
global.socket = require("../common/socket/socket")(io, {
    type: "socket",
    validEvent: ['c2s'],
    errorEvent: (ctx, code) => {
        //console.log('出现错误:', genErrorMsg(code));
        ctx.method.genError(code);
    }
});

