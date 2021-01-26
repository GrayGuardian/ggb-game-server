const router = require('koa-router')();
router.prefix('/user');
router.post('/login', async (ctx, next) => {
    let body = ctx.request.body;
    let username = body.username;
    let password = body.password;
    let result = logic_mgr.login(username, password);
    console.log('登录情况:', result);
    ctx.body = result;

    // center_mgr.rpc('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值1' }, (data) => { console.log('tttRet>>>', data); })
    // let data = await center_mgr.rpcAsync('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值2' });
    // console.log(data);
});


module.exports = router;