/*
  Author: Michael Feger
  Purpose: Contains routes relating to users
*/

var express = require('express');
const { registerValidator } = require('../middleware/validation');
const UserModel = require('../models/Users');
var router = express.Router();
var bcrypt = require('bcryptjs');
//const {registerValidator} = require('../middleware/validation.js');

router.post('/register',registerValidator, (req, res)=>{
    console.log("register route reached");
    console.log(req.body.email);
    console.log(req.body.password);

    UserModel.accountAvailable(req.body.email, req.body.password).then((alreayexists)=>{
        if(alreayexists) {
            console.log("Account already exists");
            req.flash('error', 'This account already exists!');
            res.render('unauthenticated/registration');
        } else {
            return UserModel.accountCreate(req.body.email, req.body.password).then((data) =>{
                console.log(data);
                req.flash('success', 'Account created!');
                res.render('unauthenticated/login')
            }).catch((err)=>{
                console.log(err);
                req.flash('error', 'Account not created!');
                res.render('unauthenticated/registration')
            });
        }
    }).catch((err) => { 
        console.log(err)
        res.render('unauthenticated/registration');
    });
    return;
});

router.post('/login', (req, res)=>{
    console.log("login route reached");
    console.log(req.body.email);
    console.log(req.body.password);

    UserModel.accountExists(req.body.email, req.body.password).then((exists)=>{
        console.log(exists);
        if(exists) {
            console.log("Account exists for login");
            console.log('logged in');
            req.session.username = req.body.email;
            req.session.userId = req.body.email;
            res.locals.logged = true;
            
            console.log("Username: " + req.session.username);
            console.log("Password: " + req.session.req.body.password);
            /*
                @Patrick Celedio
                Returning username for dashboard greeting prompt
            */
            req.flash('success', 'You are logged in!');
            res.render('authenticated/dashboard', {username: req.session.username});
        }   else {
            req.flash('error', 'This email and password combination does not exist.');
            res.render('unauthenticated/login');
        }
    }).catch((err) => { 
        console.log(err)
        res.render('unauthenticated/registration');
    });
    return;
});

router.post('/logout',(req, res, next) =>{
    console.log('logout reached');
    req.session.destroy((err)=>{
    
      if(err){
        console.log(err);
        console.log("session could not be destroyed");
        next(err);
      }else{
        console.log("session was destroyed");
        console.log(err);
        res.locals.logged = false;
        res.clearCookie('csid');
        res.json({status:'OK', message: "user is logged out"});
      }
    
});});



module.exports = router;