var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/authenticated/dashboard', function(req, res, next) {
  res.render('index', { title: 'USERNAME\'s Dashboard' });
});

module.exports = router;
