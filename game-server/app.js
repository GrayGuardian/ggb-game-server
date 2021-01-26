require('../common/global');
const Koa = require('koa');
const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Url:${SERVER_URL} Port:${SERVER_PORT}`);

//socket.io
global.center_mgr = require('../common/center_mgr')();
global.rpc_mgr = require('./rpc/rpc_mgr');

// center_mgr.rpc('login-server0', 'ttt', { msg: '我是game-server传来的ttt的msg值1' }, (data) => { console.log('tttRet>>>', data); })
// center_mgr.rpc('login-server0', 'ttt', { msg: '我是game-server传来的ttt的msg值2' }, (data) => { console.log('tttRet>>>', data); })

