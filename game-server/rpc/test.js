module.exports = function (prototype) {
    prototype.ttt = async function (data, callback) {

        let json = data.json.toString("utf8");
        let player = await Player.jsonParse(json);

        console.log(player.baseInfo)
        console.log(player.arr)
        console.log(player.table)
        console.log(player.aaa)
        console.log(player.currency.baseInfo)
        console.log(player.currency.arr)
        console.log(player.currency.table)
        console.log(player.currency.aaa)

        console.log(player.get_pid())
        console.log(player.currency.get_pid())

        callback({ msg: `我是${SERVER_NAME}回过来的tttRet数据` })
    }
};