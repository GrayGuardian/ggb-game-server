
var RpcMgr = function () { };

RpcMgr.prototype.getAidByPID = async function (pid) {
    let data = await redis.get(`pid=${pid}`);
    if (data == null)
        return null;
    return data.aid;
}
RpcMgr.prototype.getUidByPID = async function (pid) {
    let data = await redis.get(`pid=${pid}`);
    if (data == null)
        return null;
    return data.uid;
}

RpcMgr.prototype.delModelByPID = async function (pid) {
    let aid = await this.getAidByPID(pid);
    if (aid == null) {
        return null;
    }
    let player = null;
    let config = server_config.getGameServerConfigByAID(pid);
    if (SERVER_NAME == config.name) {
        //本服操作
        player = await model_mgr.delModelByPID(pid);
    }
    else {
        //跨服操作
        await center_mgr.rpcAsync(config.name, 'delModelByPID', { pid: pid })
    }
    return player;
}
RpcMgr.prototype.getPlayer = async function (pid) {
    let aid = await this.getAidByPID(pid);
    if (aid == null) {
        return null;
    }
    let player = null;
    let config = server_config.getGameServerConfigByAID(pid);
    if (SERVER_NAME == config.name) {
        //本服操作
        player = await model_mgr.getPlayer(pid);
    }
    else {
        //跨服操作
        let data = await center_mgr.rpcAsync(config.name, 'getPlayer', { pid: pid })
        let json = data.json.toString("utf8");
        player = await Player.jsonParse(json);
    }
    return player;
}
RpcMgr.prototype.setPlayer = async function (player) {
    let pid = player.pid;
    let aid = await this.getAidByPID(pid);
    if (aid == null) {
        return false;
    }
    let config = server_config.getGameServerConfigByAID(pid);
    if (SERVER_NAME == config.name) {
        //本服操作
        return await model_mgr.setPlayer(player);
    }
    else {
        return ((await center_mgr.rpcAsync(config.name, 'setPlayer', { json: Buffer.from(player.toJson()) })) == SUCCESS_CODE);
    }
}
RpcMgr.prototype.delPlayer = async function (pid) {
    let aid = await this.getAidByPID(pid);
    if (aid == null) {
        return null;
    }
    let player = null;
    let config = server_config.getGameServerConfigByAID(pid);
    if (SERVER_NAME == config.name) {
        //本服操作
        player = await model_mgr.delPlayer(pid);
    }
    else {
        //跨服操作
        await center_mgr.rpcAsync(config.name, 'delPlayer', { pid: pid })
    }
    return player;
}


RpcMgr.prototype.socketChannelOperToAllServer = async function (name, param) {
    let arr = [];
    server_config.getServerList("connect-server").forEach(config => {
        arr.push(config.name);
    });
    return await this.socketChannelOper(arr, name, param);
}

RpcMgr.prototype.socketChannelOper = async function (server, name, param) {
    let result = null;
    if (!Array.isArray(server)) {
        result += await this._socketChannelOper(server, name, param);
    }
    else {
        server.forEach(async (s) => {
            result += await this._socketChannelOper(s, name, param);
        });
    }
    return result;
}




RpcMgr.prototype._socketChannelOper = async function (server, name, param) {
    let result = null;
    if (SERVER_NAME == server) {
        //本服操作
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
        return result
    }
    else {
        //跨服操作
        result = await center_mgr.rpcAsync(server, "socketChannelOper", { name: name, param: Buffer.from(JSON.stringify(param)) })
        result = result.result;
        result = result.toString('utf8');
        if (result == "") {
            result = null
        }
        else {
            result = JSON.parse(result);
        }
        return result;
    }
}



module.exports = function () { return new RpcMgr(); };