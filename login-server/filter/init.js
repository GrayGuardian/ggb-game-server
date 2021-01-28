
module.exports = async (ctx, next) => {
    ctx.state.code = SUCCESS_CODE;
    ctx.state.protoName = util.toUpperCase(ctx.originalUrl.substr(1), '/').replace('/', '_');
    ctx.genError = function (code) {
        if (code == SUCCESS_CODE) {
            console.error(`不可设置的错误码 code:${code}`);
            return;
        }
        ctx.state.code = code;
        ctx.callback();
    }
    ctx.callback = function (data) {
        let protoName = `${ctx.state.protoName}Ret`;
        if (ctx.state.code != SUCCESS_CODE) {
            //错误
            protoName = 'Error';
            data = genErrorMsg(ctx.state.code);
        }
        let body = {};
        body[protoName] = data;
        data = protocol.format('http.rpcRet', body);
        if (data == null || data[protoName] == null) {
            ctx.genError(ERROR_CODE.RPCRET_ERROR);
            return;
        }

        console.log(`http rpcRet >> url:${ctx.originalUrl} data:${JSON.stringify(data[protoName])}`);
        ctx.body = data[protoName];
    }

    await next();
}