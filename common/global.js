const util = require('./util/util');

//生产环境 Master or Dev
global.PRO_ENV = 'Dev';

//服务器配置获取
var argv = process.argv;
var arr = argv[1].split('\\');
global.SERVER_TYPE = arr[arr.length - 2];
global.SERVER_ORDER = Number(argv.splice(2));
global.SERVER_NAME = `${SERVER_TYPE}${SERVER_ORDER}`;
global.server_config = require('./config/server_config')(SERVER_TYPE, SERVER_ORDER);
global.SERVER_URL = server_config.config.url;
global.SERVER_PORT = server_config.config.port;

global.protocol = require('./protocol')();

global.util = require('./util/util');