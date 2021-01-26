require('../common/global');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Url:${SERVER_URL} Port:${SERVER_PORT}`);

//http
const user = require('./routes/user');
app.use(bodyParser())
app.use(user.routes(), user.allowedMethods())

app.listen(SERVER_PORT, () => {
    console.log(`Http Server Start >>> http://${SERVER_URL}:${SERVER_PORT}`);
});

//socket.io
global.center_mgr = require('../common/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr');


// center_mgr.rpc('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值1' }, (data) => { console.log('tttRet>>>', data); })
// center_mgr.rpc('game-server0', 'ttt', { msg: '我是login-server传来的ttt的msg值2' }, (data) => { console.log('tttRet>>>', data); })