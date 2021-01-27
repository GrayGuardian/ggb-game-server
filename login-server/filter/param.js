
module.exports = async (ctx, next) => {
    let param;
    if (ctx.request.method == 'POST') {
        param = ctx.request.body;
    }
    else {
        param = ctx.request.query;
    }
    let protoTypeName = ctx.originalUrl.substr(1).replace('/', '.');
    let new_param = protocol.format(protoTypeName, param);
    if (!new_param) {
        ctx.body = { code: '403', tip: "参数缺省或错误" };
    }
    else {
        ctx.param = new_param;
        next();
    }

};