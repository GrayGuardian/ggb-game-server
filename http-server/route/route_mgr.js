
var Route = function () { };

require('./user')(Route.prototype);

module.exports = function () { return new Route(); };