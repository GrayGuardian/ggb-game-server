
module.exports = function (prototype) {

    prototype.login = async function (ctx, next) {
        console.log(await center_mgr.rpcAsync("game-server0", "ttt", { msg: `我是${SERVER_NAME}传过去的tttRet数据` }));

        let param = ctx.request.body;
        let username = param.username;
        let password = param.password;
        let result = await logic_mgr.login(username, password);
        if (result.code > SUCCESS_CODE) {
            ctx.method.genError(result.code);
            return;
        }
        let token = util.token.encrypt({ uid: result.uid });
        ctx.response.body = { code: SUCCESS_CODE, msg: '登录成功', info: result, token: token };
        await next();
    }

    prototype.register = async function (ctx, next) {
        let param = ctx.request.body;
        let username = param.username;
        let password = param.password;
        let password1 = param.password1;
        if (password != password1) {
            ctx.method.genError(ERROR_CODE.PASSWORD_NOTSAME);
            return;
        }
        let result = await logic_mgr.register(username, password);
        if (result.code > SUCCESS_CODE) {
            ctx.method.genError(result.code);
            return;
        }
        let token = util.token.encrypt({ uid: result.uid });
        ctx.response.body = { code: SUCCESS_CODE, msg: '注册成功', info: result, token: token }
        await next();
    }

}