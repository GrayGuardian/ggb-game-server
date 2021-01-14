const Configs = require('../common/config/configs');
const Koa = require('koa');
const app = new Koa();


//服务器信息获取
var argv = process.argv;
var arr = argv[1].split('\\');
global.SERVER_TYPE = arr[arr.length - 2];
var idx = Number(argv.splice(2));
global.SERVER_NAME = `${SERVER_TYPE}${idx}`;
global.SERVER_PORT = Configs.servers[SERVER_TYPE].port + idx;
console.log('Server Start>>>', `Type:${SERVER_TYPE} Name:${SERVER_NAME} Port:${SERVER_PORT}`);


const bodyParser = require('koa-bodyparser');
const router = require('./app/routers.js');


app.use(bodyParser());
app.use(router.routes());

app.listen(SERVER_PORT, () => {
	console.log('启动成功>>', `http://localhost:${SERVER_PORT}`);
});