
module.exports = function (prototype) {
    prototype.conn = async function (ctx) {
        let token = util.token.decrypt(ctx.data.token);
        if (token == null || token.uid == null || token.aid == null || token.pid == null) {
            ctx.method.kick(ERROR_CODE.TOKEN_ERROR);
            return;
        }
        let uid = token.uid;
        let aid = token.aid;
        let pid = token.pid;

        await rpc_mgr.socketChannelOperToAllServer('kick', [`uid=${uid}`, ERROR_CODE.USER_REPEATED_LOGIN])

        let s = socket.io.connections.get(ctx.socket.id);

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
        heatbeat_mgr.heatBeat(ctx.socket.id)

        ctx.method.callback({ now: Date.unix() })
    }
};