const { Router } = require("express");
const router = Router();

router.use("/auth", require('./auth'));
router.use("/bet", require('./bet'));
router.use("/parlay", require('./parlay'));

module.exports = router;