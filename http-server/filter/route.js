
module.exports = async (ctx, next) => {
    await route_mgr[ctx.state.router](ctx,next);
};