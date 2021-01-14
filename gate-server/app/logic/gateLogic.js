var GateLogic = function () {

}
GateLogic.prototype.aaa = function (ctx) {
    console.log(ctx.request, ctx.request.query.a);
}

module.exports = function () {
    return new GateLogic();
}