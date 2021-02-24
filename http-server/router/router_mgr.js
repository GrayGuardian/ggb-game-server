
var Router = function () { };

require('./user')(Router.prototype);
require('./area')(Router.prototype);

module.exports = function () { return new Router(); };