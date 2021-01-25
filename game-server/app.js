require('../common/global');
const Koa = require('koa');
const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Url:${SERVER_URL} Port:${SERVER_PORT}`);

//socket.io
global.center_mgr = require('../common/center_mgr')();

center_mgr.send('login-server0', 'ttt', { msg: '123123' })

