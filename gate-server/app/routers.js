const Router = require('koa-router');
const router = new Router();

const Logic = require('./logic/logic');

router.get('/', Logic.gate.aaa);

module.exports = router;
