var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
const handlebars = require("express-handlebars");
const ListingModel = require('./back-end/models/Listings');
const MessageModel = require('./back-end/models/Messages');
var hbs = require("hbs");
var app = express();
var bcrypt = require('bcryptjs');
var flash = require('express-flash');
const { searchValidator } = require('./back-end/middleware/validation');

app.use(sessions({
  key: "key",
  secret: "this is a secret",
  store:  mysqlSessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

var aboutRouter = require('./back-end/routes/About.js');
var usersRouter = require('./back-end/routes/Users.js');
var indexRouter = require('./back-end/routes/Index.js');
var postsRouter = require('./back-end/routes/Posts.js');
var messageRouter = require('./back-end/routes/Messages.js');
var listingRouter = require('./back-end/routes/Listing.js');


// view engine setup
app.engine('.hbs', handlebars.engine({extname: ".hbs"}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/front-end/views'));
app.set('partials', path.join(__dirname, '/front-end/views/partials'));
app.use("/public", express.static(path.join(__dirname, "/front-end/public")));

var mysqlSessionStore = new mysqlSession({}, require('./back-end/database.js'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(req.session);
  if(req.session.username){
    res.locals.logged = true;
  } 
  next();
});

app.use('/', indexRouter); // HANDLES ROUTES FOR ALL MAIN PAGES
app.use('/about_team', aboutRouter); // HANDLES ROUTES FOR ABOUT TEAM PAGE AS WELL AS INDIVIDUAL TEAM MEMBER DESCRIPTIONS
app.use('/Users', usersRouter) // HANDLES ROUTES FOR ANYTHING RELATED TO USER VALIDATION
app.use('/posts', postsRouter) // HANDLES ROUTES FOR ANYTHING RELATED TO POSTS
app.use('/messages', messageRouter) //HANDLES ROUTES FOR ANYTHING RELATED TO MESSAGES
app.use('/listing', listingRouter) // HANDLES ROUTES FOR ANYTHING RELATED TO LISTINGS

// Get searchGET
app.get('/searchGET', searchValidator, (request, response, next) => {
  let total = 0;
  let tokens = [];
  ListingModel.search(request, response).then((items)=>{
    response.locals.items = items;
    let object = JSON.stringify(items);
    console.log(object);

    /*
    @ Patrick Celedio
    Container to store the number of items returned from DB
    */

    tokens = object.split("idlisting");
    
    total = tokens.length - 1;
    console.log(total);
    if(total == 0){ //If zero items are returned, show the user something
      ListingModel.getMostRecent().then((items)=>{
        response.locals.items = items;
        let object = JSON.stringify(items);
        tokens = object.split("idlisting");
        total = tokens.length - 1;
        console.log(object);
        request.flash('error', "Your search did not return any results, try checking your spelling or use more general terms. Here are the 10 most recent listings posted");
        response.render('unauthenticated/searchresults',{total: total});
      })
    }else{
      console.log(total + " items returned.");
      response.render('unauthenticated/searchresults',{total: total});
    }
  })
  .catch((err)=>{
    console.log(err);
  });

});

// Get homepageGET
app.get('/homepageGET', (request, response) => {
  ListingModel.search(request, response).then((items)=>{
    response.locals.items = items;
    
    response.render('index',{});
  })
  .catch((err)=>{
    console.log(err);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
