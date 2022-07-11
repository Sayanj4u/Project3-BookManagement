const jwt = require('jsonwebtoken')
const secretKey = "Functionup-Radon"
const mongoose=require("mongoose")

const bookModel = require("../models/bookModel")

const authCheck = async function(req, res, next) {
    try {
        const book = req.params.bookId
        if(!mongoose.isValidObjectId(book)){
            return res.status(400).send({ status: false, messege: "bookId is Invalid" });
        }
        const books = await bookModel.findById({_id:book})
        if(!books){ return res.status(404).send({status:false,message:"No such book found with this Id"})}
    
    
        const checkDelete = await bookModel.findById({_id:book})
        if(checkDelete.isDeleted===true){ return res.status(404).send({status:false,message: "Book is already Deleted"})}
    

        let token = req.headers['x-api-key'] || req.headers['X-api-key']
        if (!token) {
            return res.status(401).send({ status: false, message: "token must be present" })
        }
        try{
            let decoded = jwt.verify(token, secretKey);
            }catch(error){
            return res.status(401).send({status:false,message:"invalid token or token expired"})
        }

        let decoded = jwt.verify(token, secretKey,{ignoreExpiration:true})
         
        if (Date.now()>decoded.exp*1000) {
            return res.status(401).send({ status: false, message: "token is expired" })
        }
        const bookid = await bookModel.findById({_id:book})
    
        let logiUserId=bookid.userId.toString()
        if(logiUserId!== decoded.userId){
            return res.status(403).send({status:false, msg:"Login user is different"})
        }
        next()
    } catch (error) {
        res.status(500).send({ status: false, Error:error.message })
    }
}

module.exports = {authCheck}