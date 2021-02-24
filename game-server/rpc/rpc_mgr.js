var RpcMgr = function () { };
require('./test')(RpcMgr.prototype);

module.exports = function () { return new RpcMgr(); };