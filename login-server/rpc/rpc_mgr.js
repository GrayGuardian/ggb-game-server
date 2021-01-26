var Rpc = function () { };

require('./test')(Rpc.prototype);

module.exports = function () { return new Rpc(); };