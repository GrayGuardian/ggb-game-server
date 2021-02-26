require('../common/global');
const Koa = require('koa');
const static = require('koa-static');
const range = require('koa-range');

const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.center_mgr = require('../common/socket/center_mgr')();
global.rpc_router = require('./rpc/rpc_router')();

//http
app.use(range);
app.use(static(__dirname + '/public'));

app.listen(SERVER_PORT, () => {
    console.log(`Http Server Start >>> http://${SERVER_IP}:${SERVER_PORT}`);
});
