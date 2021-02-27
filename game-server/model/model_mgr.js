var ModelMgr = function () {
    this.playerMap = new Map();
};

ModelMgr.prototype.delModelByPID = async function (pid) {
    this.delPlayer(pid);
}

ModelMgr.prototype.getPlayer = async function (pid) {
    let model = this.playerMap.get(pid);
    if (model == null) {
        model = await Player.create(pid, pid);
        this.playerMap.set(pid, model);
    }
    return model;
}
ModelMgr.prototype.setPlayer = async function (player) {
    this.playerMap.set(player.pid, player);
    return true;
}
ModelMgr.prototype.delPlayer = async function (pid) {
    let model = this.playerMap.get(pid);
    if (model != null) {
        this.playerMap.delete(pid);
    }
}


module.exports = function () { return new ModelMgr(); };