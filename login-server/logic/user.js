
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
        if (!REGULAR_CODE.USERNAME_VALID.test(username)) {
            return genErrorMsg(ERROR_CODE.USERNAME_ERROR);
        }
        if (!REGULAR_CODE.PASSWORD_VALID.test(password)) {
            return genErrorMsg(ERROR_CODE.PASSWORD_ERROR);
        }
        if (await this.isExist(username)) {
            return genErrorMsg(ERROR_CODE.USERNAME_EXIST);
        }
        let rows = await mysql.callAsync('CALL create_user(?,?,?)', [username, util.md5(password), Date.unix()]);
        if (rows.length > 0) {
            return rows[0];
        }
        return genErrorMsg(ERROR_CODE.UNKNOWN_ERROR);
    }
};