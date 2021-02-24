
module.exports = function (prototype) {
    prototype.conn = async function (ctx) {
        console.log('c2s>>>conn', ctx.router, ctx.data);
        console.log(ctx.socket.aaa);
        ctx.method.callback({});
        //ctx.socket.disconnect();
        //ctx.method.genError(ERROR_CODE.PASSWORD_NOTSAME)
    }

};