const IOClient = require('socket.io-client');
module.exports = function (prototype) {
    prototype.connection = async function (ctx) {

    }
    prototype.disconnect = async function (ctx) {
        //console.log("disconnect");
        let socket = ctx.socket;
        socket_channel.del(socket.name, socket);
    }
    prototype.rpc = async function (ctx) {
        let data = ctx.data;

        //是否本地处理无需转发，二次本地转发处理
        if (data.to == SERVER_NAME) {
            //二次转发
            if (socket_mgr[data.router] != null) {
                socket_mgr[data.router](ctx)
            }
            return;
        }


        //转发逻辑
        console.log('消息中转', data);
        if (socket_channel.exist(data.to)) {
            socket_channel.emit(data.to, 'rpc', ctx.body)
        }
        else {
            let config = server_config.getCenterServerConfigByName(data.to);
            console.log(`不在当前center-server转发 消息中转>>> ${data.to}==>${config.name}`)
            let t_socket = IOClient(`ws://${config.ip}:${config.port}/`);
            if (t_socket == null) {
                console.error(`未找到有效的Socket连接 Server:`, data.to)
                return;
            }
            t_socket.emit('rpc', ctx.body);
        }
    }
    prototype.rpcRet = function (ctx) {
        let data = ctx.data;

        console.log('消息回调中转', data);
        if (socket_channel.exist(data.to)) {
            socket_channel.emit(data.to, 'rpcRet', ctx.body)
        }
        else {
            let config = server_config.getCenterServerConfigByName(data.to);
            console.log(`不在当前center-server转发 消息中转>>> ${data.to}==>${config.name}`)
            let t_socket = IOClient(`ws://${config.ip}:${config.port}/`);
            if (t_socket == null) {
                console.error(`未找到有效的Socket连接 Server:`, data.to)
                return;
            }
            t_socket.emit('rpcRet', ctx.body);
        }
    }
};