var SocketMgr = function () { };
require('./base')(SocketMgr.prototype);
require('./rpc')(SocketMgr.prototype);
require('./local')(SocketMgr.prototype);
module.exports = function () { return new SocketMgr(); };