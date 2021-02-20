
var Route = function () { };

require('./api')(Route.prototype);

module.exports = function () { return new Route(); };