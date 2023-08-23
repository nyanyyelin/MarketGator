/*
  Author: Ethan Lunderville, Patrick Celedio
  Purpose: Index.js handles routing for rending provided pages 
*/

var express = require('express');
var router = express.Router();
const ListingModel = require('../models/Listings');
const {getUserMessageCardsForInbox} = require('../models/Messages');
const {getListingById} = require('../middleware/listingmiddleware');
const { searchValidator } = require('../middleware/validation');


// Get index page
// Author: Patrick Celedio
// Purpose: Return newest listings when clicking homepage
router.get('/', (request, response) => {
  ListingModel.search(request, response).then((items)=>{
    response.locals.items = items;
    response.render('index', {});
  })
  .catch((err)=>{
    console.log(err);
  });
});

// Get proofofconcept page
router.get('/searchresults', (request, response) => {
    response.render('unauthenticated/searchresults');
  });

// Get register page
router.get('/registration', (request, response) => {
  response.render('unauthenticated/registration');
});

// Get login page
router.get('/login', (request, response) => {
  response.render('unauthenticated/login');
});

// Get dashboard page
router.get('/dashboard', (request, response) => {
  /*
    @Patrick Celedio
    If a local session exist, return the username
  */
  if (response.locals.logged == true){
    console.log("Dashboard accessed. " + request.session.username + " is logged.");
  }else{
    console.log("Dashboard is accessed. No session available.");
  }
  response.render('authenticated/dashboard', {username: request.session.username} );
});

// Get inbox page
router.get('/inbox', (request, response) => {
    /*
    @Patrick Celedio
    If a local session exist, return the username
  */
    if (response.locals.logged == true){
      console.log("Inbox accessed. " + request.session.username + " is logged.");
      
    }else{
      console.log("Inbox is accessed. No session available.");
    }
    getUserMessageCardsForInbox(request.session.username).then((data)=>{
      console.log(data);
      response.locals.items = data.map((conversation)=>{
          if (String(conversation['sender']).trim() == request.session.username) {
              return { displayName : conversation['reciever'], path: conversation['thumbnail'] , id: conversation['listing_idlisting']};
          }
            return { displayName : conversation['sender'], path: conversation['thumbnail'] , id: conversation['listing_idlisting']};
      });
      response.locals.items = [...new Map(response.locals.items.map((m) => [m.id, m])).values()];
      response.locals.me = request.session.username;
      response.render('authenticated/inbox');
      return;
    })
    .catch((err)=>{console.log(err);});

});

// Get terms and conditions page
router.get('/termsconditions', (request, response) => {
  response.render('unauthenticated/termsconditions');
});

// Get create listing page
router.get('/create-listing', (request, response) => {
  response.render('authenticated/createListing');
});

// Get create listing page
router.get('/view-listing', (request, response) => {
  response.render('authenticated/viewlisting');
});

router.get("/listing/:idlisting(\\d+)", getListingById, (req, res, next) => {
  console.log(res.locals.currentListing);
    res.render("authenticated/viewlisting", {title: `Post ${req.params.idlisting}`});
    //next()
});
 
 
module.exports = router;