
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

        s.uid = uid;
        s.aid = aid;
        s.pid = pid;

        socket_channel.add(`uid=${uid}`, s);
        socket_channel.add(`aid=${aid}`, s);
        socket_channel.add(`pid=${pid}`, s);

        redis.set(`pid=${pid}`, { uid: uid, aid: aid, pid: pid })

        ctx.method.callback({});
        // socket_channel.send("ssa", "error", { codvasdfasdfe: 539, msvsdafg: "fdsalvjsdlf" })
        // socket_channel.genError("ssa", 202)
        //ctx.socket.disconnect();
        //ctx.method.genError(ERROR_CODE.PASSWORD_NOTSAME)
    }

};