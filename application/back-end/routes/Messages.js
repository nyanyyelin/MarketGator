/*
  Author: Michael Feger
  Purpose: Contains routes relating to messages
*/

var express = require('express');
var router = express.Router();
const UserModel = require('../models/Users');
const { successPrint, errorPrint } = require('../middleware/errormiddleware');
const { create } = require('../models/Messages');
const { getUserMessageCardsForInbox } = require('../models/Messages');
const {getMessageById, getConversationbyId} = require('../middleware/messagemiddleware');
const { getUserMessages } = require('../models/Messages');


router.post('/create', (req, res, next) => {
    /*if(!req.session.username){
        res.json({
            code: -1,
            status:"danger", 
            message:"Must be logged in to create a comment"
        });
    }else{*/
        
        /*
            @Patrick Celedio
            For now we will comment out sender and reciever,
            in order to get barebones messaging created
        */
        // let {sender, reciever, message} = req.body;
        let {message} = (req.body);
    
        console.log("Checking req.body");
        console.log(req.body.reciever);
        let sender = req.session.username;
        if (sender === undefined) {
            console.log("Sender not logged in");
            console.log("Message post will be aborted");
            next();
            return;
        }
        let receiver = req.body.reciever;
        let listing_idlisting = req.body.listing_idlisting;
        console.log("Sender: " + sender);
        console.log("Receiver: " + receiver);
        console.log("Message: " + message);
        console.log("idlisting: " + listing_idlisting)
    
        /*
            @Patrick Celedio
            For now we will comment out sender and reciever,
            in order to get barebones messaging created
        */
        create(message, sender, receiver, listing_idlisting)
        .then((wasSuccessful) => {
            if(wasSuccessful != -1){
                successPrint(`Message captured ${message}`);
                console.log(listing_idlisting);
                res.json({
                   code: 1,
                   status: "success",
                   message: message,
                   sender: sender,
                   receiver: receiver,
                   listing_idlisting: listing_idlisting,
                })
            }else{
                errorPrint('message was not saved')
                res.json({
                    code: -1,
                    status:"danger",
                    message:"message was not created"
                })
            }
        }).catch((err) => next(err));
    }
)
router.get('/messageGET', getMessageById, (request, response, next) => {
    console.log("Start print JSON object");
    console.log(response.locals.results);
    console.log("End print JSON object");
    next()

});

router.get('/conversationGET', getConversationbyId, (request, response, next) => {
    console.log("Hello");
    //let user = req.session.username;
    console.log("Start print JSON object");
    console.log(response.locals.results);
    console.log("End print JSON object");
    next()

});

/*
// @Patrick Celedio
// Old code, keeping for in case for rollback

// router.post('/create', (req, res, next) => {
//     /*if(!req.session.username){
//         res.json({
//             code: -1,
//             status:"danger", 
//             message:"Must be logged in to create a comment"
//         });
//     }else{*/
        
//         /*
//             @Patrick Celedio
//             For now we will comment out sender and reciever,
//             in order to get barebones messaging created
//         */
//         // let {sender, reciever, message} = req.body;
//         let {message} = req.body;
//         console.log("Checking req.body");
//         let sender = req.session.username;
//         console.log(req.body);
    
//         /*
//             @Patrick Celedio
//             For now we will comment out sender and reciever,
//             in order to get barebones messaging created
//         */
//         create(message, sender, reciever)
//         .then((wasSuccessful) => {
//             if(wasSuccessful != -1){
//                 successPrint(`comment was created for ${sender}`);
//                 successPrint(`Message captured ${message}`);
//                 res.json({
//                    code: 1,
//                    status: "success",
//                    message:"message created",
//                    message: message,
//                    sender: request.session.username,
//                    reciever: reciever,
//                 })
//             }else{
//                 errorPrint('message was not saved')
//                 res.json({
//                     code: -1,
//                     status:"danger",
//                     message:"message was not created"
//                 })
//             }
//         }).catch((err) => next(err));
//     }
// )


router.get('/searchpostbyconversation', (request, response) => {

    let sender = request.query.sender;
    let reciever = request.session.username;
    let idpost = request.query.idpost;

    getUserMessageCardsForInbox(request.session.username).then((data)=>{

        response.locals.items = data.map((conversation) => {
            
            if (String(conversation['sender']).trim() == request.session.username) {
                return { displayName : conversation['reciever'], path: conversation['thumbnail'] , id: conversation['listing_idlisting'], me : request.session.username};
            }
              return { displayName : conversation['sender'], path: conversation['thumbnail'] , id: conversation['listing_idlisting'], me : request.session.username};
        });

        response.locals.items = [...new Map(response.locals.items.map((m) => [m.id, m])).values()];

        response.locals.me = request.session.username;
        return getUserMessages(sender, reciever, idpost)
      })
      .then((data)=>{
        response.locals.messages = data;
        let name = "";
        response.locals.items.forEach((e)=>{
            if (e['id'] === response.locals.messages[0]['listing_idlisting'] ) {
                    name = e['displayName'];
            }
        });

        response.locals.messages.forEach((e)=>{
            e['created'] = e['created'].toLocaleString('en-US');
        }); 

        reciever = name;
        response.render('authenticated/inbox', {messages: response.locals.messages, idlisting: response.locals.messages[0]['listing_idlisting'], reciever: reciever});
        return;
      })
      .catch((err)=>{console.log(err);});

});

module.exports = router;