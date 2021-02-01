require('../common/global');
const Koa = require('koa');
const app = new Koa();
const server = require('http').Server(app.callback());

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Url:${SERVER_URL} Port:${SERVER_PORT}`);

//socket.io
global.socket_mgr = require('./socket/socket_mgr')(server);


server.listen(SERVER_PORT, () => {
    console.log(`WebSocket Server Start >>> ws://${SERVER_URL}:${SERVER_PORT}`);
});


