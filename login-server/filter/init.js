
module.exports = async (ctx, next) => {
    ctx.state.code = 200;
    ctx.state.protoName = util.toUpperCase(ctx.originalUrl.substr(1), '/').replace('/', '_');
    ctx.genError = function (code) {
        if (code == 200) {
            console.error(`不可设置的错误码 code:${code}`);
            return;
        }
        ctx.state.code = code;
        ctx.callback();
    }
    ctx.callback = function (data) {
        let protoName = `${ctx.state.protoName}Ret`;
        if (ctx.state.code != 200) {
            //错误
            protoName = 'Error';
            data = genCodeMessage(ctx.state.code);
        }
        let body = {};
        body[protoName] = data;
        data = protocol.format('http.rpcRet', body);
        if (data == null || data[protoName] == null) {
            ctx.genError(ERROR_CODE.RPCRET_ERROR);
            return;
        }
        console.log(`Http RpcRet >> url:${ctx.originalUrl} data:${data[protoName]}`);
        ctx.body = data[protoName];
    }
    await next();
}