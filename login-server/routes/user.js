
const router = require('koa-router')();
router.prefix('/user');
router.post('/login', async (ctx, next) => {
    let param = ctx.state.param;
    let username = param.username;
    let password = param.password;
    let result = await logic_mgr.login(username, password);
    if (result.code > SUCCESS_CODE) {
        ctx.genError(result.code);
    }
    else {
        let token = util.token.encrypt({ uid: result.uid });
        ctx.callback({ code: SUCCESS_CODE, msg: '登录成功', info: result, token: token });
    }
});
router.post('/register', async (ctx, next) => {
    let param = ctx.state.param;
    let username = param.username;
    let password = param.password;
    let password1 = param.password1;
    if (password != password1) {
        ctx.genError(ERROR_CODE.PASSWORD_NOTSAME);
        return;
    }
    let result = await logic_mgr.register(username, password);
    if (result.code > SUCCESS_CODE) {
        ctx.genError(result.code);
    }
    else {
        let token = util.token.encrypt({ uid: result.uid });
        ctx.callback({ code: SUCCESS_CODE, msg: '注册成功', info: result, token: token });
    }
});

module.exports = router;