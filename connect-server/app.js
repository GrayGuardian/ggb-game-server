require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket');
const app = new Koa();
const io = new IO()
io.attach(app)

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

io.use(async (ctx,next)=>{ 
    ctx.method = {};
    //错误码相关
    ctx.code = SUCCESS_CODE;
    ctx.method.genError = function (code) {
        if (code == SUCCESS_CODE) {
            console.error(`不可设置的错误码 code:${code}`);
            return;
        }
        ctx.code = code;
        ctx.method.callback();
    }
    //返回函数
    ctx.method.callback = function (data) {
        let router = `${ctx.router}Ret`;
        if (ctx.code != SUCCESS_CODE) {
            router = "error"
            data = genErrorMsg(ctx.code);
        }
        let body = {};
        body.router = router;
        body[router] = data;
        let bytes = pb.encode(`socket_pb.s2c`, body);
        if (bytes == null) {
            ctx.method.genError(ERROR_CODE.RPCRET_ERROR);
            return;
        }
        console.log(`socket.s2c router:${router} body:`, pb.decode("socket_pb.s2c", bytes))
        ctx.socket.emit("s2c", bytes);
    }
    await next();
});

app.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
})

global.center_mgr = require('../common/socket/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr')();
global.logic_mgr = require('./logic/logic_mgr')();

global.socket_mgr = require("./socket/socket_mgr")();
global.socket = require("../common/socket/socket")(io, {
    type: "socket",
    validEvent: ['c2s'],
    errorEvent: (ctx, code) => {
        console.log('出现错误:', genErrorMsg(code));
    }
});
