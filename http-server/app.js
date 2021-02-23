require('../common/global');
const Koa = require('koa');

const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.center_mgr = require('../common/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr')();
global.logic_mgr = require('./logic/logic_mgr')();

global.route_mgr = require('./route/route_mgr')();

//http
const init = require('./filter/init');
const token = require('./filter/token');
const route = require('./filter/route');
const s2c = require('./filter/s2c');
const logic_mgr = require('./logic/logic_mgr');
const rpc_mgr = require('./rpc/rpc_mgr');

app.use(init);
app.use(token);
app.use(route);
app.use(s2c);

app.listen(SERVER_PORT, () => {
    console.log(`Http Server Start >>> http://${SERVER_IP}:${SERVER_PORT}`);
});