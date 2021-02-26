
var Router = function () { };

Router.prototype.login = async function (ctx, next) {

    // let player = await Player.create(1, 1);
    // player.arr = [`我是player在${SERVER_NAME}中修改的arr1`, `我是player在${SERVER_NAME}中修改的arr2`]
    // player.table = { a: [`我是player在${SERVER_NAME}中修改的arr1`, `我是player在${SERVER_NAME}中修改的arr2`], b: "bbbbbbbbbbbbbbbbbbbb" }
    // player.aaa = `我是player在${SERVER_NAME}中修改的aaa值`

    // player.currency.arr = [`我是player_currency在${SERVER_NAME}中修改的arr1`, `我是player_currency在${SERVER_NAME}中修改的arr2`]
    // player.currency.table = { a: [`我是player_currency在${SERVER_NAME}中修改的arr1`, `我是player_currency在${SERVER_NAME}中修改的arr2`], b: "bbbbbbbbbbbbbbbbbbbb" }
    // player.currency.aaa = `我是player_currency在${SERVER_NAME}中修改的aaa值`

    // let json = player.toJson()

    // console.log(player.baseInfo)
    // console.log(player.arr)
    // console.log(player.table)
    // console.log(player.aaa)
    // console.log(player.currency.baseInfo)
    // console.log(player.currency.arr)
    // console.log(player.currency.table)
    // console.log(player.currency.aaa)

    // console.log(player.get_phone())
    // console.log(player.currency.get_pid())

    // let p = await Player.jsonParse(json);
    // console.log(json)
    // console.log(p.get_phone())

    // center_mgr.rpc("game-server0", "ttt", { msg: `我是${SERVER_NAME}传递过来的ttt数据`, json: Buffer.from(json) });

    let param = ctx.request.body;
    let username = param.username;
    let password = param.password;
    let user = await logic_mgr.login(username, util.md5(password));
    if (user.code > SUCCESS_CODE) {
        ctx.method.genError(user.code);
        return;
    }
    let areas = await logic_mgr.getAreaInfoList();
    let area = areas[0];
    if (user.aid != null) {
        areas.forEach(element => {
            if (user.aid == element.aid)
                area = element;
        });
    }
    let data = { info: user };
    data.token = util.token.encrypt({ uid: user.uid });
    data.areas = areas;
    data.area = area;
    ctx.response.body = data;
    await next();
}

Router.prototype.register = async function (ctx, next) {
    let param = ctx.request.body;
    let username = param.username;
    let password = param.password;
    let password1 = param.password1;
    if (password != password1) {
        ctx.method.genError(ERROR_CODE.PASSWORD_NOTSAME);
        return;
    }
    let result = await logic_mgr.register(username, password);
    if (result.code > SUCCESS_CODE) {
        ctx.method.genError(result.code);
        return;
    }
    let token = util.token.encrypt({ uid: result.uid });
    ctx.response.body = { info: result, token: token }
    await next();
}
Router.prototype.nextArea = async function (ctx, next) {
    let param = ctx.request.body;
    let aid = param.aid;
    let areaInfo = await logic_mgr.getAreaInfo(aid);
    if (areaInfo == null) {
        ctx.method.genError(ERROR_CODE.AREA_NOTEXIST);
        return;
    }
    if (areaInfo.ismaintenance == 1) {
        ctx.method.genError(ERROR_CODE.AREA_MAINTENANCE);
        return;
    }
    let rows;
    rows = await mysql.queryAsync('SELECT * FROM player_info WHERE aid = ? AND uid = ?', [aid, ctx.user.uid]);
    if (rows.length == 0) {
        ctx.method.genError(ERROR_CODE.UNKNOWN_ERROR);
        return;
    }
    let players = JSON.parse(JSON.stringify(rows));

    rows = await mysql.queryAsync('UPDATE user_info SET aid = ? WHERE uid = ?', [aid, ctx.user.uid]);
    if (rows.length == 0) {
        ctx.method.genError(ERROR_CODE.UNKNOWN_ERROR);
        return;
    }

    let token = util.token.encrypt({ uid: ctx.user.uid, aid: aid });
    ctx.response.body = { token: token, players: players };
    await next();
}
Router.prototype.enterGame = async function (ctx, next) {
    let aid = ctx.user.aid;
    if (aid == null) {
        ctx.method.genError(ERROR_CODE.TOKEN_ERROR);
        return;
    }
    let config = server_config.getConnectServerConfigByAID(ctx.user.aid);

    ctx.response.body = { url: `${config.ip}:${config.port}` };
    await next();
}

module.exports = function () { return new Router(); };