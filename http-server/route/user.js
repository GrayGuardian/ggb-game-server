
module.exports = function (prototype) {

    prototype.login = async function (ctx, next) {
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
        if (user.aid!=null){
            areas.forEach(element => {
                if(user.aid == element.aid)
                    area = element; 
            });
        }
        let data = { code: SUCCESS_CODE, msg: '登录成功', info: user};
        data.token = util.token.encrypt({ uid: user.uid });
        data.areas = areas;
        data.area = area;       
        ctx.response.body = data;
        await next();
    }

    prototype.register = async function (ctx, next) {
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
        ctx.response.body = { code: SUCCESS_CODE, msg: '注册成功', info: result, token: token }
        await next();
    }

}