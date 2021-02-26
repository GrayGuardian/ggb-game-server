var SocketMgr = function () { };

require('./base')(SocketMgr.prototype);
require('./logic')(SocketMgr.prototype);
module.exports = function () { return new SocketMgr(); };