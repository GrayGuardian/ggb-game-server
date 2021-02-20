
module.exports = function (prototype) {
    prototype.isExist = async function (username) {
        let rows = await mysql.queryAsync('SELECT username FROM user_info WHERE username = ?', username);
        if (rows.length > 0) {
            return true;
        }
        return false;
    }
    prototype.login = async function (username, password) {
        let rows = await mysql.queryAsync('SELECT * FROM user_info WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            await mysql.queryAsync('UPDATE user_info SET login_time = ? WHERE uid = ?', [Date.unix(), rows[0].uid]);
            return rows[0];
        }
        return genErrorMsg(ERROR_CODE.PASSWORD_ERROR);
    }
    prototype.register = async function (username, password) {
        if (!REGULAR_CODE.USERNAME_VALID.test(username)) {
            return genErrorMsg(ERROR_CODE.USERNAME_NOTVALID);
        }
        if (!REGULAR_CODE.PASSWORD_VALID.test(password)) {
            return genErrorMsg(ERROR_CODE.PASSWORD_NOTVALID);
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