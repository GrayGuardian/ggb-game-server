
var Logic = function () { };

require('./user')(Logic.prototype);
require('./area')(Logic.prototype);

module.exports = function () { return new Logic(); };