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
    USERNAME_ERROR: genCode(),
    PASSWORD_ERROR: genCode(),
}

const ERROR_MSG = {
    [ERROR_CODE.SUCCESS]: '成功',
    [ERROR_CODE.UNKNOWN_ERROR]: '未知错误',
    [ERROR_CODE.PARAM_ERROR]: '参数缺省或格式错误',
    [ERROR_CODE.RPCRET_ERROR]: '返回参数错误',

    [ERROR_CODE.PASSWORD_NOTSAME]: '两次密码不相同',
    [ERROR_CODE.USERNAME_EXIST]: '用户名已存在',
    [ERROR_CODE.USERNAME_ERROR]: '用户名格式错误：6-15位的大小写字母、数字、下划线、星号',
    [ERROR_CODE.PASSWORD_ERROR]: '密码格式错误：6-15位的大小写字母、数字、下划线、星号',
}

exports.ERROR_CODE = ERROR_CODE;
exports.genCodeMessage = function (code) {
    let data = {};
    let msg = ERROR_MSG[code + ''];
    data.code = code;
    data.msg = msg == null ? ERROR_MSG[ERROR_CODE.UNKNOWN_ERROR] : msg;
    return data;
}