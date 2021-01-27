module.exports = function () {
    return new MYSQL();
}
var MySql = require('mysql');
var config = require('../config/mysql.json');
var MYSQL = function () {
    this.client = MySql.createConnection(config);
    this.client.connect();
}


MYSQL.prototype.queryAsync = function (sql, param) {
    return new Promise((resolve) => {
        this.client.query(sql, param, function (error, rows, fields) {
            if (error) throw error;
            resolve(rows);
        });
    });
}
MYSQL.prototype.query = function (sql, param, cb) {
    this.client.query(sql, param, function (error, rows, fields) {
        if (error) throw error;
        if (cb != null) cb(rows);
    });
} 