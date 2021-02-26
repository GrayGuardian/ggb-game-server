
let getPostData = function (ctx) {
    return new Promise(function (resolve, reject) {
        try {
            ctx.req.on('data', function (data) {
                resolve(data);
            })
            ctx.req.on('end', function (chunk) {
                resolve(null)
            })
        } catch (e) {
            reject(e)
        }

    })
}
module.exports = async (ctx, next) => {
    //防止跨域问题
    ctx.set('Access-Control-Allow-Origin', '*');

    ctx.user = {};
    ctx.method = {};
    //错误码相关
    ctx.state.code = SUCCESS_CODE;
    ctx.method.genError = function (code) {
        if (code == SUCCESS_CODE) {
            console.error(`不可设置的错误码 code:${code}`);
            return;
        }
        ctx.state.code = code;
        ctx.method.callback();
    }
    //返回函数
    ctx.method.callback = function (data) {
        let router = `${ctx.state.router}Ret`;
        if (ctx.state.code != SUCCESS_CODE) {
            router = "error"
            data = genErrorMsg(ctx.state.code);
        }
        let body = {};
        body.router = router;
        body[router] = data;
        let bytes = pb.encode(`http_pb.http_s2c`, body);
        if (bytes == null) {
            ctx.method.genError(ERROR_CODE.HTTP_ERROR_RETURN);
            return;
        }
        console.log(`http.s2c router:${router} body:`, pb.decode("http_pb.http_s2c", bytes))
        ctx.body = bytes;
    }
    //路由判断
    // if (toString(ctx.originalUrl) != '/api' || ctx.request.method != 'POST') {
    //     ctx.method.genError(ERROR_CODE.ROUTE_ERROR);
    //     return;
    // }

    //获取内容
    let body = pb.decode("http_pb.http_c2s", await getPostData(ctx));
    if (body == null) {
        ctx.method.genError(ERROR_CODE.HTTP_ERROR_DATA);
        return;
    }
    ctx.state.router = body.router
    ctx.request.body = body[body.router];
    console.log(`http.c2s router:${ctx.state.router} body:`, body)
    await next();
}