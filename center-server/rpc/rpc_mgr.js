var RpcMgr = function () { };
require('./base')(RpcMgr.prototype);
require('./rpc')(RpcMgr.prototype);
require('./local')(RpcMgr.prototype);
module.exports = function () { return new RpcMgr(); };