const router = require('koa-router')();
router.prefix('/user');
router.post('/login', async (ctx, next) => {
    console.log('登录', ctx.request.body);
});


module.exports = router;