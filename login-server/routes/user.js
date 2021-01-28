
const router = require('koa-router')();
router.prefix('/user');
router.post('/login', async (ctx, next) => {
    let param = ctx.state.param;
    let username = param.username;
    let password = param.password;
    let result = logic_mgr.login(username, password);
    console.log('登录情况:', result);
    ctx.body = result;
    // center_mgr.rpc('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值1' }, (data) => { console.log('tttRet>>>', data); })
    // let data = await center_mgr.rpcAsync('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值2' });
    // console.log(data);


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