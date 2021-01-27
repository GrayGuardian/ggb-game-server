const router = require('koa-router')();
router.prefix('/user');
router.post('/login', async (ctx, next) => {
    let param = ctx.param;
    let username = param.username;
    let password = param.password;
    let result = logic_mgr.login(username, password);
    console.log('登录情况:', result);
    ctx.body = result;


});
router.post('/register', async (ctx, next) => {
    // center_mgr.rpc('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值1' }, (data) => { console.log('tttRet>>>', data); })
    // let data = await center_mgr.rpcAsync('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值2' });
    // console.log(data);

    let param = ctx.param;
    let username = param.username;
    let password = param.password;
    let password1 = param.password1;
    if (password != password1) {
        ctx.body = { code: 500, msg: '二次密码不一致' };
        return;
    }
    ctx.body = { code: 200, msg: '注册成功' };
});

module.exports = router;