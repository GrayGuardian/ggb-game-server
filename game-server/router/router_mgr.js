
var RouterMgr = function () { };

RouterMgr.prototype.enterGame = async function (ctx, player, data) {
    console.log("enterGame", data, player.baseInfo);
    console.log((await rpc_mgr.getPlayer(ctx.data.pid)).aaa, ">>>>")
    player.aaa = { c: ["我是aaa数值1", "我是aaa数值1"], v: "valsdjfgkladsgf", ddd: 1234124 };

    console.log(await rpc_mgr.setPlayer(player), ">>>>")
    console.log((await rpc_mgr.getPlayer(ctx.data.pid)).aaa, ">>>>")
    ctx.method.callback({});
}

module.exports = function () { return new RouterMgr(); };