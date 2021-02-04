require('../common/global');
const Koa = require('koa');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Url:${SERVER_URL} Port:${SERVER_PORT}`);

//http
app.use(cors());
app.use(bodyParser());
//拦截器
const init = require('./filter/init');
const param = require('./filter/param');
const token = require('./filter/token');
app.use(init);
app.use(param);
app.use(token);
//路由
const user = require('./routes/user');
app.use(user.routes(), user.allowedMethods());

app.listen(SERVER_PORT, () => {
    console.log(`Http Server Start >>> http://${SERVER_URL}:${SERVER_PORT}`);
});

//socket.io
global.center_mgr = require('../common/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr')();
global.logic_mgr = require('./logic/logic_mgr')();

