var SUCCESS_CODE = 200;
var systemCode = SUCCESS_CODE;
var logicCode = 500;

const genSystemCode = function () {
    systemCode++;
    return systemCode;
}
const genLogicCode = function () {
    logicCode++;
    return logicCode;
}
const ERROR_CODE = {
    SUCCESS: SUCCESS_CODE,
    UNKNOWN_ERROR: genSystemCode(),
    PARAM_ERROR: genSystemCode(),
    RPCRET_ERROR: genSystemCode(),
    ROUTE_ERROR: genSystemCode(),
    TOKEN_ERROR: genSystemCode(),

    PASSWORD_NOTSAME: genLogicCode(),
    USERNAME_EXIST: genLogicCode(),
    USERNAME_NOTVALID: genLogicCode(),
    PASSWORD_NOTVALID: genLogicCode(),
    PASSWORD_ERROR: genLogicCode(),

    AREA_NOTEXIST: genLogicCode(),
    AREA_MAINTENANCE: genLogicCode(),
}

const ERROR_MSG = {
    [ERROR_CODE.SUCCESS]: '成功',
    [ERROR_CODE.UNKNOWN_ERROR]: '未知错误',
    [ERROR_CODE.PARAM_ERROR]: '参数缺省或格式错误',
    [ERROR_CODE.RPCRET_ERROR]: '返回参数错误',
    [ERROR_CODE.ROUTE_ERROR]: '访问路由出错',
    [ERROR_CODE.TOKEN_ERROR]: '非法访问', //Token值错误

    [ERROR_CODE.PASSWORD_NOTSAME]: '两次密码不相同',
    [ERROR_CODE.USERNAME_EXIST]: '用户名已存在',
    [ERROR_CODE.USERNAME_NOTVALID]: '用户名格式错误：6-15位的大小写字母、数字、下划线、星号',
    [ERROR_CODE.PASSWORD_NOTVALID]: '密码格式错误：6-15位的大小写字母、数字、下划线、星号',
    [ERROR_CODE.PASSWORD_ERROR]: '密码错误',

    [ERROR_CODE.AREA_NOTEXIST]: '区服不存在',
    [ERROR_CODE.AREA_MAINTENANCE]: '区服正在维护',
}
const genErrorMsg = function (code) {
    let data = {};
    let msg = ERROR_MSG[code];
    data.code = code;
    data.msg = msg == null ? ERROR_MSG[ERROR_CODE.UNKNOWN_ERROR] : msg;
    return data;
}
module.exports = { SUCCESS_CODE: SUCCESS_CODE, ERROR_CODE: ERROR_CODE, genErrorMsg: genErrorMsg }