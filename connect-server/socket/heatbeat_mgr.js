
const schedule = require('node-schedule');
const TIMEOUT_TIME = 15 * 60;   //超时时间（秒）
var HeatBeatMgr = function () {
    this.heatBeatMap = new Map();

    var rule = new schedule.RecurrenceRule();
    rule.minute = [1, 16, 31, 46];
    schedule.scheduleJob(rule, () => {
        //定时清理心跳包数据
        this.heatBeatMap.forEach((value, key) => {
            this.checkTimeOut(key);
        });
    });
};
HeatBeatMgr.prototype.checkTimeOut = function (socketid) {
    let lastTime = this.heatBeatMap.get(socketid);
    if (lastTime != null) {
        let offset = Date.unix() - lastTime;
        if (offset >= TIMEOUT_TIME) {
            this.kick(socketid);
        }
        if (socket_channel.visitSocket(socketid) == null) {
            this.heatBeatMap.delete(socketid);
        }
    }
}
HeatBeatMgr.prototype.heatBeat = function (socketid) {
    this.checkTimeOut(socketid);
    this.heatBeatMap.set(socketid, Date.unix());
}
HeatBeatMgr.prototype.kick = function (socketid) {
    //心跳包超时踢出
    socket_channel.kick(socketid);
}
module.exports = function () { return new HeatBeatMgr(); };