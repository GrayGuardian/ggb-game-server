
module.exports = function (prototype) {
    prototype.conn = async function (ctx) {
        let token = util.token.decrypt(ctx.data.token);
        if (token == null || token.uid == null || token.aid == null || token.pid == null) {
            ctx.method.kick(ERROR_CODE.TOKEN_ERROR);
            return;
        }
        let s = socket.io.connections.get(ctx.socket.id);

        let uid = token.uid;
        let aid = token.aid;
        let pid = token.pid;
        let socketid = ctx.socket.id;

        s.uid = uid;
        s.aid = aid;
        s.pid = pid;

        socket_channel.add(`uid=${uid}`, s);
        socket_channel.add(`aid=${aid}`, s);
        socket_channel.add(`pid=${pid}`, s);
        socket_channel.add(socketid, s);

        redis.set(`pid=${pid}`, { uid: uid, aid: aid, pid: pid, socketid: socketid })


        ctx.method.callback({});
    }
    prototype.heartBeat = async function (ctx) {
        console.log("接收到心跳包>>>", ctx.socket.uid, ctx.socket.aid, ctx.socket.pid, ctx.data);

        ctx.method.callback({ now: Date.unix() })
    }
};