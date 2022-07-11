const jwt = require('jsonwebtoken')
const secretKey = "Functionup-Radon"
const mongoose=require("mongoose")

const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")

const updateCheckReview = async function(req, res, next) {
    try {
        let token = req.headers['x-api-key'] || req.headers['X-api-key']
        if (!token) {
            return res.status(401).send({ status: false, message: "token must be present" })
        }
        try{
            let decoded = jwt.verify(token, secretKey);
            }catch(error){
            return res.status(401).send({status:false,message:"invalid token or token expired"})
        }

        const {reviewId,bookId} = req.params
        if(!mongoose.isValidObjectId(bookId)){
            return res.status(400).send({ status: false, messege: "bookId is Invalid" });
        }
    
        const books = await bookModel.findById({_id:bookId})
        if(!books){ return res.status(404).send({status:false,message:"No such book found with this Id"})}
    
        const bookDeleteCheck = await bookModel.find({$and:[{_id:bookId},{isDeleted:true}]})
        if(bookDeleteCheck.length>0){ return res.status(404).send({status:false,message:"Book is deleted already"})}

        if(!mongoose.isValidObjectId(reviewId)){
            return res.status(400).send({ status: false, messege: "reviewId is Invalid" });
        }
    
        const review = await reviewModel.findById({_id:reviewId})
        if(!review){ return res.status(404).send({status:false,message:"No such Review found with this Id"})}
    
        const reviewDeleteCheck = await reviewModel.find({$and:[{_id:reviewId}, {isDeleted:true}]})
        if(reviewDeleteCheck.length>0){ return res.status(404).send({status:false,message:"Review is deleted already"})}

        let decoded = jwt.verify(token, secretKey,{ignoreExpiration:true})
         
        if (Date.now()>decoded.exp*1000) {
            return res.status(401).send({ status: false, message: "token is expired" })
        }
        const bookid = await bookModel.findById({_id:bookId})
    
        let logiUserId=bookid.userId.toString()
        if(logiUserId!== decoded.userId){
            return res.status(403).send({status:false, msg:"Login user is different"})
        }
        next()
    } catch (error) {
        res.status(500).send({ status: false, Error:error.message })
    }
}

module.exports = {updateCheckReview}