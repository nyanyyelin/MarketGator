let registerValidator = (req,res,next) => { 

    let email = req.body.email;
    let password = req.body.password;

    //EMAIL REGEX
    let emailbool = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );
    //PASSWORD REGEX
    let passwordbool = password.toLowerCase().match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,16}$/);

    let sfsucheck = email.slice(-8);
    console.log(sfsucheck);
    if(sfsucheck != "sfsu.edu")
        emailbool = 0;

    if (emailbool && passwordbool){
        console.log(email);
        console.log(password);
        next();
    } else {
        if(!emailbool){
            req.flash('error', "You must use an SFSU email address")
        }
        else if(!passwordbool){
            req.flash('error', "Invalid password, please check the listed password requirements");
        }
        res.render('unauthenticated/registration')
    }
    return;

}

let searchValidator = (req,res,next) => {
    let searchTerm = req.query.search;
    console.log(searchTerm);
    var searchBool = 1;

    if(searchTerm.length > 40){
        searchBool = 0;
    }
    if(searchBool == 1){
        console.log("Search Check passed");
        next();
    } else {
        console.log("Search Check failed");
        req.flash('error', 'Search results must be less than 40 chars');
        res.render('unauthenticated/searchresults');
        console.log(req.session);
    }
} 

let loginValidator = (req,res,next) => {} 

/*
    Check if user is logged in
*/
function requireLogin(req, res, next) {
    // Check if the user is logged in
    if (!req.session.userId) {
        // If the user is not logged in, redirect them to the registration page
        return res.render('unauthenticated/registration');
    }
  
    // If the user is logged in, allow the request to continue to the next middleware or route handler
    next();
}

module.exports = {registerValidator, loginValidator, requireLogin, searchValidator};