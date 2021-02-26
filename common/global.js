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
global.SERVER_IP = server_config.config.ip;
global.SERVER_PORT = server_config.config.port;

global.pb = require('./pb')();
global.tpl = require("./template/tpl");

global.util = require('./util/util');

global.mysql = require('./db/mysql')();
global.redis = require('./db/redis')();

const ERROR_INFO = require('./const/ERROR_INFO');
global.SUCCESS_CODE = ERROR_INFO.SUCCESS_CODE;
global.ERROR_CODE = ERROR_INFO.ERROR_CODE;
global.genErrorMsg = ERROR_INFO.genErrorMsg;

global.REGULAR_CODE = require('./const/REGULAR_CODE');

global.rpc_mgr = require('./rpc/rpc_mgr')();

//Model
global.Player = require('./model/player');
global.PlayerCurrency = require('./model/player_currency');
