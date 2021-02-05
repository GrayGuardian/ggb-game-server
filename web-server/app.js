require('../common/global');
const Koa = require('koa');
const static = require('koa-static');
const range = require('koa-range')
const app = new Koa();

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Url:${SERVER_URL} Port:${SERVER_PORT}`);

//http
app.use(range);
app.use(static(__dirname + '/public'));

app.listen(SERVER_PORT, () => {
    console.log(`Http Server Start >>> http://${SERVER_URL}:${SERVER_PORT}`);
});
//socket.io
global.center_mgr = require('../common/center_mgr')();
