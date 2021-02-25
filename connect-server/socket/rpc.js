const IOClient = require('socket.io-client');
module.exports = function (prototype) {
    prototype.c2s = async function (ctx) {
        let router = ctx.data.router;
        let data = ctx.data[router]

        console.log(`socket.c2s router:${router} body:`, data)

        let action = socket_mgr[router];
        if (action != null) {
            //本地转发
            ctx.router = router;
            ctx.data = data;
            action(ctx);
        }
        else {
            //转发至game-server
            console.log("转发至game-server>>>", server_config.getGameServerConfigByAID(1), ctx.data);
        }

    }
};
