
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
        console.log('踢出玩家', "router:", `kick`, 'code:', code, ' pid:', data.pid);
    }
    ctx.method.genError = async function (code) {
        console.log('出现逻辑错误', "router:", `error`, 'code:', code, ' pid:', data.pid);
    }
    ctx.method.callback = async function (body) {
        console.log('回发数据', "router:", `${router}Ret`, 'data:', body, ' pid:', data.pid);
    }

    action(ctx, player, data.data[router]);

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

module.exports = function () { return new RpcRouter(); };