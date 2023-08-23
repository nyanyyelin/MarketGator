var express = require('express');
var router = express.Router();

/* GET about us. */
router.get('/rdevdhar', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
