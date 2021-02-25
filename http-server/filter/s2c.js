module.exports = async (ctx, next) => {

    if (ctx.response.body == null) {
        ctx.method.genError(ERROR_CODE.HTTP_ERROR_RETURN)
    }
    else {
        ctx.method.callback(ctx.response.body);
    }
    await next();
};