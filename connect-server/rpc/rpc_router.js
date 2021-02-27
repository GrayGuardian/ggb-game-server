var RpcRouter = function () { };

RpcRouter.prototype.sendToChannel = async function (data, callback) {
    let param = JSON.parse(data.param.toString("utf8"))
    let result = await socket_channel.send(param.key, param.router, param.data)
    console.log(param, result)
    callback({ result: Buffer.from(JSON.stringify(result)) });
}

RpcRouter.prototype.socketChannelOper = async function (data, callback) {
    let name = data.name;
    let param = data.param;
    param = JSON.parse(param.toString('utf8'));

    let result = null;
    let len = param != null ? param.length : 0;
    if (len == 0) {
        result = await socket_channel[name]()
    }
    else if (len == 1) {
        result = await socket_channel[name](param[0])
    }
    else if (len == 2) {
        result = await socket_channel[name](param[0], param[1])
    }
    else if (len == 3) {
        result = await socket_channel[name](param[0], param[1], param[2])
    }
    result = result == null ? '' : result;
    callback({ result: Buffer.from(JSON.stringify(result)) });
}
module.exports = function () { return new RpcRouter(); };