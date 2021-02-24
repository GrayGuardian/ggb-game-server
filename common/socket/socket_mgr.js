
module.exports = function (io, opts) {
    return new SocketMgr(io, opts || {});
}
var SocketMgr = function (io, opts) {
    this.io = io;
    this.opts = opts;
    this.type = opts.type;
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
        console.log("io user1")
        if (validEvent.indexOf(ctx.event) == -1) {
            //不被允许通过的event
            return;
        }
        if (Buffer.isBuffer(ctx.data)) {
            //需要协议解析数据
            let data = pb.decode(`${this.type}_pb.${ctx.event}`, ctx.data);
            if (data == null) {
                console.log('错误的消息格式>>', data);
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
    let action = rpc_mgr[key];
    if (action == null) {
        console.error('未找到rpc Action>>', key);
        return false;
    }
    await action(ctx);
    return true;
} 