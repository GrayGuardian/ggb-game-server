module.exports = function (prototype) {
    prototype.ttt = function (rpc, callback) {
        //console.log("game-server rpc ttt>>>>>", rpc);
        callback({ msg: `我是${SERVER_NAME}回过来的tttRet数据` })
    }
};