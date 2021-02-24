module.exports = function (io) {
    return new SocketChannel(io);
}

var SocketChannel = function (io) {
    this.io = io;

    this.channel = new Map();
}
SocketChannel.prototype.visitSocket = function (socket) {
    if (typeof (socket) == 'string') {
        socket = this.io.connections.get(socket);
    } else {
        if (socket.id == null) return null;
        socket = this.io.connections.get(socket.id);
    }
    if (socket == null) return null;
    return socket;
}
SocketChannel.prototype.get = function (key, socket) {
    socket = this.visitSocket(socket);
    if (socket == null) return null;
    if (!this.channel.get(key)) return null;
    return this.channel.get(key).get(socket.id);
}
SocketChannel.prototype.add = function (key, socket) {
    if (typeof (key) == "string") {
        if (Array.isArray(socket)) {
            socket.forEach(s => {
                this._addOneSocket(key, s);
            });
        }
        else {
            this._addOneSocket(key, socket);
        }
    } else if (Array.isArray(key)) {
        key.forEach(k => {
            if (Array.isArray(socket)) {
                socket.forEach(s => {
                    this._addOneSocket(k, s);
                });
            }
            else {
                this._addOneSocket(k, socket);
            }
        });
    }
}
SocketChannel.prototype.del = function (key, socket) {
    if (typeof (key) == "string") {
        if (Array.isArray(socket)) {
            socket.forEach(s => {
                this._delOneSocket(key, s);
            });
        }
        else {
            this._delOneSocket(key, socket);
        }
    } else if (Array.isArray(key)) {
        key.forEach(k => {
            if (Array.isArray(socket)) {
                socket.forEach(s => {
                    this._delOneSocket(k, s);
                });
            } else {
                this._delOneSocket(k, socket);
            }
        });
    }
}
SocketChannel.prototype.exist = function (key, socket) {

    if (!this.channel.get(key)) return false;
    if (socket != null) {
        socket = this.visitSocket(socket);
        if (socket == null) return false;
        return this.channel.get(key).get(socket.id) != null;
    }
    return true;
}
SocketChannel.prototype.delAllSocket = function (socket) {
    socket = this.visitSocket(socket);
    if (socket == null) return false;

    this.channel.forEach((value, key) => {
        this._delOneSocket(key, socket);
    });
    return true;
}

SocketChannel.prototype.emit = function (key, route, data) {
    let result = 0;
    if (typeof (key) == "string") {
        result += this._emitOneChannel(key, route, data);
    } else if (Array.isArray(key)) {
        key.forEach(k => {
            result += this._emitOneChannel(k, route, data);
        });
    }
    return result;
}
SocketChannel.prototype.clearChannel = function (key) {
    if (typeof (key) == "string") {
        this._clearOneChannel(key)
    } else if (Array.isArray(key)) {
        key.forEach(k => {
            this._clearOneChannel(k);
        });
    }
}


SocketChannel.prototype._addOneSocket = function (key, socket) {

    socket = this.visitSocket(socket);
    if (socket == null) return false;

    if (!this.channel.get(key)) {
        //初始化通道
        this.channel.set(key, new Map())
    }
    let channel = this.channel.get(key)
    channel.set(socket.id, socket);
    return true
}
SocketChannel.prototype._delOneSocket = function (key, socket) {
    socket = this.visitSocket(socket);
    if (socket == null) return false;

    if (!this.channel.get(key)) return false;
    let socketMap = this.channel.get(key);
    socketMap.delete(socket.id)
    if (socketMap.size == 0) this.channel.delete(key);
    return true
}
SocketChannel.prototype._emitOneChannel = function (key, route, data) {
    let result = 0;
    if (!this.channel.get(key)) return result;
    this.channel.get(key).forEach((socket, id) => {
        socket.emit(route, data);
        result += 1;
    });
    return result;
}
SocketChannel.prototype._clearOneChannel = function (key) {
    this.channel.delete(key);
    return true;
}