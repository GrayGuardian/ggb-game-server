
var RouterMgr = function () { };

RouterMgr.prototype.enterGame = async function (ctx, player, data) {
    console.log("enterGame", data, player.baseInfo, ctx.data.pid);

    player.set_online(1)
    await player.upDataToDB();

    player.upClientData();
    player.currency.upClientData();

    ctx.method.callback({});
}

module.exports = function () { return new RouterMgr(); };