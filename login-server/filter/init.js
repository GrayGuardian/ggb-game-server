
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

    if (ctx.originalUrl != '/api' || ctx.request.method != 'POST') {
        return;
    }

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
        let bytes = pb.encode("http_pb.s2c", body);
        if (bytes == null) {
            ctx.method.genError(ERROR_CODE.RPCRET_ERROR);
            return;
        }
        console.log(`http s2c:${body}`)
        ctx.body = bytes;
    }

    //获取内容
    let body = pb.decode("http_pb.c2s", await getPostData(ctx));
    if (body == null) {
        ctx.method.genError(ERROR_CODE.PARAM_ERROR);
        return;
    }
    console.log(`http c2s:${body}`)
    ctx.state.router = body.router
    ctx.request.body = body

    ctx.method.callback({ code: 100, msg: "sdfsad", info: { uid: 1, username: "sdfasdf" }, token: "dsfa" });
    //ctx.method.genError(ERROR_CODE.RPCRET_ERROR);




    await next();
}