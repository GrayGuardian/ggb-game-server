const IOClient = require('socket.io-client');
module.exports = function (prototype) {
    prototype.connection = async function (ctx) {
        let id = ctx.socket.id;
        let s = socket.io.connections.get(id);

        s.kick = function (code) {
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
            s.emit("s2c", bytes);
        }
    }
    prototype.disconnect = async function (ctx) {
        //console.log("disconnect");
        socket_channel.delAllSocket(ctx.socket);
    }
    prototype.c2s = async function (ctx) {
        let router = ctx.data.router;
        let data = ctx.data[router]

        console.log(`socket.c2s router:${router} body:`, data)

        let action = socket_mgr[router];
        if (action != null) {
            //本地转发
            ctx.router = router;
            ctx.data = data;
            action(ctx);
        }
        else {
            //转发至game-server
            console.log("转发至game-server>>>", server_config.getGameServerConfigByAID(1), ctx.data);
        }

    }
};