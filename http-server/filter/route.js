
module.exports = async (ctx, next) => {
    let action = route_mgr[ctx.state.router];
    if(action==null){
        ctx.method.genError(ERROR_CODE.ROUTE_ERROR);
        return;
    }
    await action(ctx,next);
};