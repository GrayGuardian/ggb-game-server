
const IO = require('koa-socket');
const io = new IO()
module.exports = function (app) {
    return new SocketMgr(app);
}
var SocketMgr = function (app) {
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

    io.use(async (ctx, next) => {
        console.log('event:', ctx.event, 'data:', ctx.data, "length:", ctx.data.length);
        //await next();
    })
}