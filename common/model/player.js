const Base = require('./base');

Base.inherits(this, Player, Base);

function Player(pid) {
    this.pid = pid;

    this.db_table = 'player_info';
    this.db_idxField = 'pid';
    this.db_fields = ["pid", 'uid', 'aid', 'rid', 'name', 'lv', 'exp', 'pos', "phone", "create_time", "login_time", "logout_time", "online"];



}
Player.create = async function (pid, idx) {
    let model = new Player(pid);
    await model.init(idx);

    model.currency = await PlayerCurrency.create(pid, pid)

    return model;
}

Player.prototype.loadDataed = function () {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    this.currency.loadData();
}


module.exports = Player