var express = require('express');
var router = express.Router();

/* GET about us. */
router.get('/mfeger', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
