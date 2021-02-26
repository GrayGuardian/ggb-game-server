
module.exports = function (prototype) {
    prototype.conn = async function (ctx) {
        let socket = ctx.socket;
        let data = ctx.data.conn;

        let dataRet = {};
        dataRet.code = ctx.data.code;
        dataRet.from = SERVER_NAME
        dataRet.to = data.name;
        dataRet.router = "connRet";

        let ip = socket.request.connection.remoteAddress.replace('::ffff:', '');
        let config = server_config.getServerConfig(data.type, data.order)
        if (config == null || config.name != data.name || config.ip != ip) {
            //无效连接
            console.log('[error]conn server client', '>>>', 'data:', data, "config:", config);
            dataRet.connRet = { code: ERROR_CODE.CONNECT_ERROR_KICK };
            socket_channel.emit(data.name, "rpcRet", pb.encode("server_pb.rpcRet", dataRet));
            socket.disconnect();
        }
        else {
            console.log('conn server client', '>>>', 'data:', data, "config:", config);
            socket.name = data.name;
            socket_channel.add(data.name, socket);
            dataRet.connRet = { code: ERROR_CODE.SUCCESS };
            socket_channel.emit(data.name, "rpcRet", pb.encode("server_pb.rpcRet", dataRet));
        }

    }
};