module.exports = function (prototype) {
    prototype.nextArea = async function (ctx, next) {
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
        let rows = await mysql.queryAsync('UPDATE user_info SET aid = ? WHERE uid = ?', [aid, ctx.user.uid]);
        if (rows.length == 0) {
            ctx.method.genError(ERROR_CODE.UNKNOWN_ERROR);
            return;
        }
        ctx.response.body = {};
        await next();
    }

}