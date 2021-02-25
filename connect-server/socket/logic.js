
module.exports = function (prototype) {
    prototype.conn = async function (ctx) {
        console.log('c2s>>>conn', ctx.router, ctx.data);
        ctx.method.callback({});
        socket_channel.send("ssa", "error", { codvasdfasdfe: 539, msvsdafg: "fdsalvjsdlf" })
        socket_channel.genError("ssa", 202)
        //ctx.socket.disconnect();
        //ctx.method.genError(ERROR_CODE.PASSWORD_NOTSAME)
    }

};