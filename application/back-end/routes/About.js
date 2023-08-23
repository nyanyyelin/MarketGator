/*
  Author: Ethan Lunderville
  Purpose: About.js handles routing for rending about pages
*/

var express = require('express');
var router = express.Router();

router.get('/', (request, response) => {
    response.render('unauthenticated/about');
  });

  router.get('/aadnan', (request, response) => {
    response.render('about_team/aadnan');
  });
  // Get elunderville
  router.get('/elunderville', (request, response) => {
    response.render('about_team/elunderville');
  });
  // Get mfeger
  router.get('/mfeger', (request, response) => {
    response.render('about_team/mfeger');
  });
  // Get nyanyelin
  router.get('/nyanyelin', (request, response) => {
    response.render('about_team/nyanyelin');
  });
  // Get rdevdhar
  router.get('/rdevdhar', (request, response) => {
    response.render('about_team/rdevdhar');
  });
  // Get pceledio
  router.get('/pceledio', (request, response) => {
    response.render('about_team/pceledio');
  });

module.exports = router;