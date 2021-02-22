const NOTTOKEN_ROUTER = ["login", "register"];

module.exports = async (ctx, next) => {
    let router = ctx.state.router;
    if (NOTTOKEN_ROUTER.indexOf(router) != -1) {
        //不需要检测Token值
        await next();
        return;
    }
    let token = util.token.decrypt(ctx.request.header.token);
    ctx.user.uid = token.uid;
    if (token == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    await next();
};