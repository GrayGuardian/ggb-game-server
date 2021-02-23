require('../common/global');
const Koa = require('koa');

const app = new Koa();
const server = require('http').Server(app.callback());

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} IP:${SERVER_IP} Port:${SERVER_PORT}`);

global.socket = require('./socket')(server);

server.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_IP}:${SERVER_PORT}`);
});


