var RpcMgr = function () { };

RpcMgr.prototype.getAid = async function (pid) {
    let data = await redis.get(`pid=${pid}`);
    if (data == null)
        return null;
    return data.aid;
}
RpcMgr.prototype.getUid = async function (pid) {
    let data = await redis.get(`pid=${pid}`);
    if (data == null)
        return null;
    return data.uid;
}

RpcMgr.prototype.getPlayer = async function (pid) {
    let aid = await this.getAid(pid);
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
        跨服操作
        let data = await center_mgr.rpcAsync(config.name, 'getPlayer', { pid: pid })
        let json = data.json.toString("utf8");
        player = await Player.jsonParse(json);
    }
    return player;
}
RpcMgr.prototype.setPlayer = async function (player) {
    let pid = player.pid;
    let aid = await this.getAid(pid);
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



module.exports = function () { return new RpcMgr(); };