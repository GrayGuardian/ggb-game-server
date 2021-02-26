module.exports = function () {
    return new Redis();
}
var redis = require('redis');
var config = require('../config/redis.json');
var Redis = function () {
    this.client = redis.createClient(config);
    this.keyOutListenEvent = [];
    //redis key过期回调
    this.client.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], (e, r) => {
        let sub = redis.createClient(config);
        sub.subscribe('__keyevent@0__:expired', () => {
            sub.on('message', (chan, key) => {
                this.keyOutListenEvent.forEach(element => {
                    //console.log('过期', key, element);
                    element(key);
                });
            });
        });
    });

}
Redis.prototype.addKeyOutListenEvent = function (event) {
    this.keyOutListenEvent.push(event);
}
Redis.prototype.set = function (key, value, outTime) {
    if (outTime == null) outTime = 0;
    let result = this.client.set(key, JSON.stringify(value));
    if (outTime > 0)
        this.client.expire(key, outTime);//设置过期时间
    return result;
}
Redis.prototype.del = function (key) {
    return this.client.del(key);
}
Redis.prototype.get = async function (key) {
    let _get = async (key) => {
        let e = await new Promise((resolve) => {
            this.client.get(key, function (err, value) {
                return resolve(value);
            });
        });
        return e;
    };
    return JSON.parse(await _get(key));
}


