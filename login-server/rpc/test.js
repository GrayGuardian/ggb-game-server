module.exports = function (prototype) {
    prototype.ttt = function (rpc, callback) {
        console.log("login-server rpc ttt>>>>>", rpc);
        callback({ msg: rpc.ttt.msg })
    }
};