const IOClient = require('socket.io-client');
module.exports = function (prototype) {
    prototype.c2s = async function (ctx) {
        console.log('c2s>>>', ctx.data)
    }
};
