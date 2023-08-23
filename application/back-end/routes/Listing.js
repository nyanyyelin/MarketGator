/*
  Author: Michael Feger
  Purpose: Contains routes relating to listings
*/

var Jimp = require('jimp');
var multer = require('multer');
var express = require('express');
const path = require('path');
const fs = require('fs')
var router = express.Router();
const {getListingById} = require('../middleware/listingmiddleware');
const {requireLogin} = require('../middleware/validation');
var ListingModel = require('../models/Listings');
var ListingError = require('../errors/ListingError');
const { successPrint, errorPrint } = require('../middleware/errormiddleware');
var crypto = require('crypto');

router.get('/', (request, response) => {
  response.render('unauthenticated/dashboard');
});



//Create multer storage variable, set image destination with randomized file name
var storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, "../application/front-end/public/images/products");
  },
  filename: function(req,file,cb){
      let fileExt = file.mimetype.split('/')[1];
      let randomName = crypto.randomBytes(22).toString("hex");
      cb(null, `${randomName}.${fileExt}`);
  }
});

var uploader = multer({storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    console.log(ext);
    if(ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.jpeg' && ext !== '.JPEG') {
        console.log("Not an image file");
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
},
limits:{
    fileSize: 1024 * 1024 //Limit image size to not overload database
}
});

router.post('/createPost', requireLogin, uploader.single("uploadImage"),(req, res, next) => { //input name must be uploadImage
   // Check if the user is logged in
   if (!req.session.userId) {
     // If the user is not logged in, redirect them to the registration page
     console.log("User is not logged in");
     req.flash('error', "Please register to create a post");
     return res.render('unauthenticated/registration');
   }

  let photoPath = req.file.path;

  //let fileUploaded = "C:\Users\micha\Desktop\648/BOOK.jpg";
  let fileAsThumbnail = `thumbnail-${req.file.filename}`;
  let destinationOfThumbnail = req.file.destination + "/thumbnails/" + fileAsThumbnail;
  let title = req.body.title;
  let description = req.body.description;
  let category = req.body.category;
  //console.log(req.session);
  let userId = req.session.userId; //ENABLE LATER
  console.log(userId);
  //let userId = 2; //DISABLE LATER
  let price = 0;
  photoPath = photoPath.replace(/\\/g, "/"); //substitute backwards slashes for forward slashes
  let saveForDelete = photoPath;



  //Validation check
  try{
  const fileType = req.file['mimetype'];
  const validImageTypes = ['image/jpeg','image/jpg', 'image/png'];
  if (!validImageTypes.includes(fileType)) {
    console.log("Invalid file type");
    throw new Error("bad image type")
  }
  if (title.length > 50){
    console.log("Invalid title length");
    throw new Error("title too long")
  }
  if (description.length > 1000){
    console.log("Invalid description length");
    throw new Error("description too long")
  }
  console.log(typeof price)
  if (!Number.isInteger(price)){
    console.log("Invalid price");
    throw new Error("price must be integer")
  }
  }catch(err){
    fs.unlinkSync(saveForDelete); //Deletes file from database
    console.error(err);
    res.redirect('/create-listing');
    return res.status(500);
  }
  //Validation check
  
  async function resize() {
    // reads the image
    try{
    const image = await Jimp.read(photoPath);
    // resizes the image to width 150 and heigth 150.
    await image.resize(200, 200);
    // saves the image on the file system
    await image.writeAsync(destinationOfThumbnail);
    }catch(err){
      console.log(err);
    }
  }
    resize();

    let thumbnail = destinationOfThumbnail.slice(31);
    photoPath = photoPath.slice(31);
    console.log(photoPath);
    console.log(thumbnail);
    console.log(userId);
       return ListingModel.create(
          title,
          description,
          photoPath,
          price,
          userId,
          category,
          thumbnail,
      )
  .then((listingWasCreated) => {
      if(listingWasCreated){
          req.flash('success', "Your listing was created successfully! Please wait 1-3 days for this listing to be approved.");
          res.redirect('/listing/'+ listingWasCreated.insertId);
      }else{
        try {
            fs.unlinkSync(saveForDelete);
            fs.unlinkSync(destinationOfThumbnail)
          } catch(err) {
            throw err;
          }
      
        console.log("failure");
          throw new ListingError('Listing could not be created', '/', 200)
      }
      
  })
  .catch((err) => {
      console.error("Error", err);
      if(err instanceof ListingError){
          errorPrint(err.getMessage());
          req.flash('error', err.getMessage());
          res.status(err.getStatus());
          res.redirect(err.getRedirectURL());
          
      }else{
          next(err);
      }
  })
});


router.get('/searchbyname', (request, response) => {
  console.log(request.body);
  ListingModel.getListingByPoster(request.session.username).then((items)=>{
    response.locals.items = items;
    let object = JSON.stringify(items);
    // console.log("Start print JSON object");
    console.log("search by name ran");
    // Print JSON string
    console.log(object);

    /*
    @ Patrick Celedio
    Container to store the number of items returned from DB
    */
    let tokens = [];
    tokens = object.split("idlisting");
    
    let total = tokens.length - 1;
    console.log(total + " items returned.");
    response.render('unauthenticated/searchresults',{total: total});
  })
  .catch((err)=>{
    console.log(err);
  });
  
});




module.exports = router;