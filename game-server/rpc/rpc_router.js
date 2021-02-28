
var RpcRouter = function () { };

RpcRouter.prototype.socketRpc = async function (data) {
    let router = data.data.router;

    let action = router_mgr[router]
    if (action == null) {
        console.log("未找到Socket路由", router);
        return;
    }
    let player = await rpc_mgr.getPlayer(data.pid);
    let ctx = {};
    ctx.data = data;
    ctx.method = {};
    ctx.method.kick = async function (code) {
        let config = server_config.getConnectServerConfigByAID(data.aid);
        return await rpc_mgr.socketChannelOper(config.name, "kick", [data.socketid, code]);
    }
    ctx.method.genError = async function (code) {
        let config = server_config.getConnectServerConfigByAID(data.aid);
        return await rpc_mgr.socketChannelOper(config.name, "genError", [data.socketid, code]);
    }
    ctx.method.callback = async function (body) {
        let config = server_config.getConnectServerConfigByAID(data.aid);
        return await rpc_mgr.socketChannelOper(config.name, "send", [data.socketid, `${router}Ret`, body]);
    }

    action(ctx, player, data.data[router]);

}
RpcRouter.prototype.delModelByPID = async function (data, callback) {
    await model_mgr.delModelByPID(data.pid);
    callback({});
}
RpcRouter.prototype.getPlayer = async function (data, callback) {
    let player = await model_mgr.getPlayer(data.pid);
    callback({ json: Buffer.from(player.toJson()) });
}
RpcRouter.prototype.setPlayer = async function (data, callback) {
    let json = data.json.toString("utf8");
    let player = await Player.jsonParse(json);
    let code = await model_mgr.setPlayer(player) ? SUCCESS_CODE : ERROR_CODE.UNKNOWN_ERROR;
    callback({ code: code });
}
RpcRouter.prototype.delPlayer = async function (data, callback) {
    await model_mgr.delPlayer(data.pid);
    callback({});
}

module.exports = function () { return new RpcRouter(); };