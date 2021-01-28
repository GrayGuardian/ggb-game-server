var code = 500;
const genCode = function () {
    code++;
    return code;
}
const ERROR_CODE = {
    SUCCESS: 200,
    UNKNOWN_ERROR: 201,
    PARAM_ERROR: 202,
    RPCRET_ERROR: 203,

    PASSWORD_NOTSAME: genCode(),
    USERNAME_EXIST: genCode(),
}

const ERROR_MSG = {
    [ERROR_CODE.SUCCESS]: '成功',
    [ERROR_CODE.UNKNOWN_ERROR]: '未知错误',
    [ERROR_CODE.PARAM_ERROR]: '参数缺省或格式错误',
    [ERROR_CODE.RPCRET_ERROR]: '返回参数错误',

    [ERROR_CODE.PASSWORD_NOTSAME]: '两次密码不相同',
    [ERROR_CODE.USERNAME_EXIST]: '用户名已存在',
}

exports.ERROR_CODE = ERROR_CODE;
exports.genCodeMessage = function (code) {
    let data = {};
    let msg = ERROR_MSG[code + ''];
    data.code = code;
    data.msg = msg == null ? ERROR_MSG[ERROR_CODE.UNKNOWN_ERROR] : msg;
    return data;
}