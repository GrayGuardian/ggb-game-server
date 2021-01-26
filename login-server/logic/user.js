module.exports = function (prototype) {
    prototype.login = function (username, password) {
        if (username == 123 && password == 123) {
            return true;
        }
        else {
            return false;
        }
    }
};