
module.exports = function (prototype) {
    prototype.connection = async function (ctx) {
        let id = ctx.socket.id;
        let s = socket.io.connections.get(id);

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
                s.genError(ERROR_CODE.RPCRET_ERROR);
                return;
            }
            s.emit("s2c", bytes);
        }

        socket_channel.add('ssa', s)
    }
    prototype.disconnect = async function (ctx) {
        //console.log("disconnect");
    }

};