require('../common/global');
const Koa = require('koa');

const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.center_mgr = require('../common/socket/center_mgr')();
global.rpc_router = require('./rpc/rpc_router')();
global.logic_mgr = require('./logic/logic_mgr')();
global.model_mgr = require('./model/model_mgr')();
global.router_mgr = require('./router/router_mgr')();

