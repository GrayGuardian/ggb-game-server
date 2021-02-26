require('../common/global');
const Koa = require('koa');

const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.center_mgr = require('../common/socket/center_mgr')();
global.rpc_router = require('./rpc/rpc_router')();
global.logic_mgr = require('./logic/logic_mgr')();

global.router_mgr = require('./router/router_mgr')();

//http
const init = require('./filter/init');
const token = require('./filter/token');
const router = require('./filter/router');
const s2c = require('./filter/s2c');

app.use(init);
app.use(token);
app.use(router);
app.use(s2c);

app.listen(SERVER_PORT, () => {
    console.log(`Http Server Start >>> http://${SERVER_IP}:${SERVER_PORT}`);
});