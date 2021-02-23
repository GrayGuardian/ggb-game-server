require('../common/global');
const Koa = require('koa');
const IO = require('koa-socket');
const app = new Koa();
const io = new IO()

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.center_mgr = require('../common/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr')();
global.logic_mgr = require('./logic/logic_mgr')();

io.use(async (ctx, next) => {
    console.log("use", ctx)
    await next();
})

io.attach(app)

io.on('connection', (sock) => {
    console.log('conn')
})
io.on('disconnect', (sock) => {
    console.log('disconn')
})
io.on('join', (ctx, data) => {
    console.log('join event fired', data)
})

app.listen(SERVER_PORT, () => {
    console.log(">>>>>>>>>>>>>>>>>>>")
})

center_mgr.rpc("game-server0", "ttt", { msg: "fjsdalkfjksla" }, (data) => { console.log("123123>>>", data) })