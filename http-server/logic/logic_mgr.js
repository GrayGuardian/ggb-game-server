
var Logic = function () { };

require('./user')(Logic.prototype);

module.exports = function () { return new Logic(); };