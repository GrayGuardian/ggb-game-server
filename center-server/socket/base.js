module.exports = function (prototype) {
    prototype.connection = async function (ctx) {

    }
    prototype.disconnect = async function (ctx) {
        //console.log("disconnect");
        let socket = ctx.socket;
        socket_channel.del(socket.name, socket);
    }

};