const IOClient = require('socket.io-client');
module.exports = function (prototype) {
    prototype.c2s = async function (ctx) {
        let router = ctx.data.router;
        let data = ctx.data[router]

        console.log(`socket.c2s router:${router} body:`, data)

        //二次转发
        let action = socket_mgr[router];
        if (action == null) {
            if (ctx.errorEvent != null) ctx.errorEvent(ctx, ERROR_CODE.CONNECT_ERROR_ROUTER);
            return;
        }
        ctx.router = router;
        ctx.data = data;
        action(ctx);
    }
};
