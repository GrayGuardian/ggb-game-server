
module.exports = async (ctx, next) => {
    let data = {};
    if (ctx.request.method == 'POST') {
        data[ctx.state.protoName] = ctx.request.body;
    }
    else {
        data[ctx.state.protoName] = ctx.request.query;
    }
    console.log(`http rpc >> url:${ctx.originalUrl} data:${JSON.stringify(data[ctx.state.protoName])}`);
    data = protocol.format('http.rpc', data);
    if (!data) {
        ctx.genError(ERROR_CODE.PARAM_ERROR);
        return;
    }
    ctx.state.param = data[ctx.state.protoName];
    await next();

};