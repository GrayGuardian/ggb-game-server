
module.exports = function (io, opts) {
    return new SocketMgr(io, opts || {});
}
var SocketMgr = function (io, opts) {
    this.io = io;

    global.socket_channel = require("./socket_channel")(io);

    //影响pb文件解析
    let validEvent = ["connection", "disconnect"]
    if (opts.validEvent != null && Array.isArray(opts.validEvent)) {
        opts.validEvent.forEach(e => {
            validEvent.push(e)
        });
    }

    validEvent.forEach(e => {
        io.on(e, async (ctx) => { });
    });
    io.use(async (ctx, next) => {
        //类型 影响pb文件选择
        ctx.type = opts.type;
        //错误回调
        ctx.errorEvent = opts.errorEvent;
        if (Buffer.isBuffer(ctx.data)) {
            //需要协议解析数据
            let data = pb.decode(`${ctx.type}_pb.${ctx.event}`, ctx.data);
            if (data == null) {
                if (ctx.errorEvent != null) ctx.errorEvent(ctx, ERROR_CODE.CONNECT_ERROR_DATA);
                return;
            }
            ctx.body = ctx.data;
            ctx.data = data;
        }
        //console.log('socket.io', "event:", ctx.event, "data:", ctx.data);
        await this.rpc(ctx.event, ctx);

        await next();
    });
    io.on('connection', (ctx) => {
        this.rpc("connection", ctx);
    })
}

SocketMgr.prototype.rpc = async function (key, ctx) {
    let action = socket_mgr[key];
    if (action == null) {
        if (ctx.errorEvent != null) ctx.errorEvent(ctx, ERROR_CODE.CONNECT_ERROR_ROUTER);
        return false;
    }
    await action(ctx);
    return true;
} 