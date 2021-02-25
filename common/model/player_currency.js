const Base = require('./base');

Base.inherits(this, Currency, Base);

function Currency(pid) {
    this.pid = pid;

    this.db_table = 'player_currency';
    this.db_idxField = 'pid';
    this.db_fields = ["pid", "gold1", "gold2", "gold3"];
}
Currency.create = async function (pid, idx) {
    let model = new Currency(pid);
    await model.init(idx);
    return model;
}
Currency.prototype.loadDataed = function () {

}
module.exports = Currency