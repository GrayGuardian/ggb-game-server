
function Base() {

}

Base.inherits = function (self, ctor, superCtor) {
    Base.call(self);
    ctor.super_ = superCtor;
    Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    for (var key in Base) {
        if (Base[key] != null) {
            ctor[key] = Base[key];
        }
    }
}
Base.jsonParse = async function (str) {
    eval(str);
    await this.loadData();
    return this;
}

Base.prototype.toJson = function () {
    return util.toJson(this, 'this');
}
Base.prototype.init = async function (idx) {
    this.idx = idx;
    this.aid = await rpc_mgr.getAidByPID(this.pid);

    //console.log(`[Model]${this.clsName} Init aid:${this.aid} idx:${this.idx}`)
    await this.loadData();
    await this.inited();
}
//从数据库更新缓存数据
Base.prototype.upDBToData = async function (refresh) {
    //console.log(`[Model]${this.clsName} 从数据库更新缓存数据`)
    let sql = `SELECT ${this.db_fields.toString()} FROM ${this.db_table} WHERE ${this.db_idxField}=?;`
    //console.log(sql, this.idx)
    //操作数据库
    let rows = await mysql.queryAsync(sql, [this.idx]);

    if (rows.length == 0) {
        console.log(`ERROR:Model loadData Error - 数据不存在 SQL:${sql} Form:${Base.clsName}`);
        return;
    }
    let row = rows[0];
    let data = {};
    this.db_fields.forEach((field) => {
        let value = row[field];
        if (Buffer.isBuffer(value)) {
            value = JSON.parse(value.toString("utf8"));
        }
        data[field] = value;
        //console.log(field, value)
    });

    //写到缓存内
    await this.loadData(data, true);

    if (refresh) {
        await this.upClientData();
    }
}
//从缓存更新数据库数据
Base.prototype.upDataToDB = async function (refresh) {
    //console.log(`[Model]${this.clsName} 从缓存更新数据库数据`)
    let arr = [];
    this.db_fields.forEach(field => {
        let value = this[`get_${field}`]();
        if (value == null) {
            value = null;
        }
        else if (typeof (value) == "object") {
            value = JSON.stringify(value);
        }
        //console.log("up>>", field, value, value == null, typeof (value));
        if (value == null) {
            arr.push(`${field}=NULL`);
        }
        else {
            arr.push(`${field}='${value}'`);
        }
    });
    let sql = `UPDATE ${this.db_table} SET ${arr.toString()} WHERE ${this.db_idxField}=?;`;
    //console.log(sql, this.idx);
    //操作数据库
    let rows = await mysql.queryAsync(sql, [this.idx]);

    if (rows.length == 0) {
        console.log(`ERROR:Model upDBData Error - 更新数据库失败 SQL:${sql} Form:${Base.clsName}`);
        return false;
    }
    if (refresh) {
        await this.upClientData();
    }
    return true;
}
//更新数据到客户端
Base.prototype.upClientData = async function () {

    let router = `upModelData`;
    let config = server_config.getConnectServerConfigByAID(this.aid);
    let data = {};
    data.name = this.clsName;
    data[this.clsName] = this.baseInfo;

    //console.log(`[Model]${this.clsName} 更新数据到客户端 router:`, router, "data:", data);

    await rpc_mgr.socketChannelOper(config.name, "send", [`pid=${this.pid}`, router, data]);
}
//初始化数据
Base.prototype.loadData = async function (data, flag) {
    if (this.baseInfo == null && data == null) {
        await this.upDBToData();
        return;
    }
    if (data != null) {
        this.baseInfo = data;
    }
    for (const key in this.baseInfo) {
        this[`get_${key}`] = () => {
            return this.baseInfo[key];
        };
        this[`set_${key}`] = (value) => {
            this.baseInfo[key] = value;
        };
    }
    if (!flag) {
        await this.loadDataed();
    }
}

//可继承

Base.prototype.inited = async function () {

}
//跨进程传递后会造成的引用地址丢失 该函数用于扩展重新初始化动态函数等需要变量引用地址的代码
Base.prototype.loadDataed = async function () {

}



module.exports = Base;
