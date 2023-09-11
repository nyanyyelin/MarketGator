/*
  Purpose: Handles the routing of anything related to usermessage UI
*/

var express = require('express');
var router = express.Router();

/* GET user message page. */
router.get('/authenticated/userinbox', function(req, res, next) {
  res.render('index', { title: 'USERNAME\'s Inbox' });
});

module.exports = router;
