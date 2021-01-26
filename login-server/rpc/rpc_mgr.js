console.log('login-server rpc');

var Rpc = function () { };

require('./test_rpc')(Rpc.prototype);

module.exports = Rpc;