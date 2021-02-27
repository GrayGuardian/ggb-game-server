
var RouterMgr = function () { };

RouterMgr.prototype.enterGame = async function (ctx, player, data) {
    console.log("enterGame", data, player.baseInfo, ctx.data.pid);


    //ctx.method.kick();

    ctx.method.callback({});
}

module.exports = function () { return new RouterMgr(); };