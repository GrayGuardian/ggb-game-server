
module.exports = function (prototype) {
    prototype.ttt = function (rpc, callback) {
        console.log("game-server rpc ttt>>>>>", rpc);
        callback({ msg: rpc.ttt.msg })
    }
};