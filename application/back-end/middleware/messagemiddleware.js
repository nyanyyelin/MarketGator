/*
  Purpose: Middleware for messages that allows you to retrieve a message by ID
*/


var db = require('../database.js');
const messageMiddleware = {}
const {getUserMessages, getConversation} = require('../models/Messages');


messageMiddleware.getMessageById = async function(req, res, next) {
    try {
        console.log(req.reciever)
        let {reciever} = req.body;
        let results = await getUserMessages(reciever);
        try{
            let results = await getUserMessages([reciever]);
            res.locals.results = results;
            next();
        }catch(error){
            next(error);
        }
    }catch (error) {
        next(error);
    }
}

messageMiddleware.getConversationbyId = async function(req, res, next) {
    try {
        console.log(req.body.sender)
        console.log(req.body.user)
        console.log(req.body.postId)
        let sender = req.body.sender;
        let user = req.body.user;
        let postId = req.body.postId
        try{
            let results = await getConversation(user, sender, postId);
            res.locals.results = results;
            next();
        }catch(error){
            next(error);
        }
    }catch (error) {
        next(error);
    }
}

module.exports = messageMiddleware;
