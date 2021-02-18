require('../common/global');
const Koa = require('koa');
const static = require('koa-static');
const range = require('koa-range')
const app = new Koa();

const bodyParser = require('koa-bodyparser');

console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Url:${SERVER_URL} Port:${SERVER_PORT}`);

//http
app.use(range);
app.use(static(__dirname + '/public'));

app.use(bodyParser({
    enableTypes: ['text']
}))



app.use(async (ctx, next) => {
    console.log(protocol.decode("s2s.ttt", Buffer.from(ctx.request.body)))
    ctx.body = protocol.encode("s2s.ttt", { msg: "我是返回的数据" }).toString()
});

app.listen(SERVER_PORT, () => {
    console.log(`Http Server Start >>> http://${SERVER_URL}:${SERVER_PORT}`);
});
//socket.io
global.center_mgr = require('../common/center_mgr')();
