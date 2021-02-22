
var Route = function () { };

require('./user')(Route.prototype);
require('./area')(Route.prototype);

module.exports = function () { return new Route(); };