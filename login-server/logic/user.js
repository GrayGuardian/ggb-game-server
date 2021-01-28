
module.exports = function (prototype) {
    prototype.isExist = async function (username) {
        let rows = await mysql.queryAsync('SELECT username FROM user_info WHERE username = ?', username);
        if (rows.length > 0) {
            return true;
        }
        return false;
    }
    prototype.login = function (username, password) {
        if (username == 123 && password == 123) {
            return true;
        }
        else {
            return false;
        }
    }
    prototype.register = async function (username, password) {
        let rows = await mysql.callAsync('CALL create_user(?,?,?)', [username, util.md5(password), Date.unix()]);
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }
};