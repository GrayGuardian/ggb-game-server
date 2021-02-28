
module.exports = function (prototype) {
    prototype.connection = async function (ctx) {
        let id = ctx.socket.id;
        let s = socket.io.connections.get(id);

        s.kick = function (code) {
            code = code == null ? ERROR_CODE.CONNECT_ERROR_KICK : code;
            let router = "kick";
            let data = { error: genErrorMsg(code) };
            s.send(router, data);
            s.disconnect();
        }
        s.genError = function (code) {
            let router = "error";
            let data = genErrorMsg(code);
            s.send(router, data);
        }
        s.send = function (router, data) {
            let body = {};
            body.router = router;
            body[router] = data;
            let bytes = pb.encode(`socket_pb.s2c`, body);
            if (bytes == null) {
                s.genError(ERROR_CODE.CONNECT_ERROR_RETURN);
                return;
            }

            if ('heartBeatRet|upModelData|'.indexOf(`${router}|`) == -1) {
                console.log(`socket.s2c uid:${s.uid} aid:${s.aid} pid:${s.pid} router:${router} body:`, body)
            }

            s.emit("s2c", bytes);
        }
    }
    prototype.disconnect = async function (ctx) {
        //console.log("disconnect");

        let player = await rpc_mgr.getPlayer(ctx.socket.pid);

        player.set_online(0)
        await player.upDataToDB(true);

        await rpc_mgr.setPlayer(player);

        await rpc_mgr.delModelByPID(ctx.socket.pid);

        socket_channel.delAllSocket(ctx.socket);
        redis.del(`pid=${ctx.socket.pid}`)



    }
    prototype.c2s = async function (ctx) {
        let uid = ctx.socket.uid;
        let aid = ctx.socket.aid;
        let pid = ctx.socket.pid;

        let router = ctx.data.router;
        let data = ctx.data[router]
        if (data == null) {
            ctx.method.genError(ERROR_CODE.CONNECT_ERROR_DATA)
            return;
        }

        if ('heartBeat|'.indexOf(`${router}|`) == -1) {
            console.log(`socket.c2s uid:${uid} aid:${aid} pid:${pid} router:${router} body:`, data)
        }


        let action = socket_mgr[router];
        if (action != null) {
            //本地转发
            ctx.router = router;
            ctx.data = data;
            action(ctx);
        }
        else {
            //转发至game-server
            let config = server_config.getGameServerConfigByAID(aid);


            center_mgr.rpc(config.name, 'socketRpc', { uid: uid, aid: aid, pid: pid, socketid: ctx.socket.id, data: ctx.data })
        }

    }
};