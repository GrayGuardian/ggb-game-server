
module.exports = function (prototype) {
    prototype.conn = async function (ctx) {
        let token = util.token.decrypt(ctx.data.token);
        if (token == null || token.uid == null || token.aid == null || token.pid == null) {
            ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
            return;
        }

        ctx.method.callback({});
        // socket_channel.send("ssa", "error", { codvasdfasdfe: 539, msvsdafg: "fdsalvjsdlf" })
        // socket_channel.genError("ssa", 202)
        //ctx.socket.disconnect();
        //ctx.method.genError(ERROR_CODE.PASSWORD_NOTSAME)
    }

};