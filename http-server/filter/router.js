
module.exports = async (ctx, next) => {
    let action = router_mgr[ctx.state.router];
    if (action == null) {
        ctx.method.genError(ERROR_CODE.HTTP_ERROR_ROUTER);
        return;
    }
    await action(ctx, next);
};