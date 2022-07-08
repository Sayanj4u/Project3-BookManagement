const mongoose = require("mongoose")
const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

const createReview = async function(req,res){
    const data = req.body

    const book = data.bookId
    
    

    const review = await reviewModel.create(data)
    const bookReview = await bookModel.findOneAndUpdate({_id:book}, {$inc:{reviews:1}})

    res.status(201).send({status:true,message:"Review Created Successfully", data:review})
}

const updateReview = async function(req,res){
    const data = req.body
    const reviewId = req.params.reviewId
    

    const review = await reviewModel.findOneAndUpdate({_id:reviewId},{ $set: data }, { new: true })
    res.status(200).send({status:true, data:review})
}


const deleteReview = async function(req,res){
   
    const {reviewId,bookId} = req.params

    const bookDeleteCheck = await bookModel.find({$and:[{_id:bookId},{isDeleted:true}]})
    if(bookDeleteCheck.length>0){ return res.status(404).send({status:false,message:"Book is deleted already"})}

    const reviewDeleteCheck = await reviewModel.find({$and:[{_id:reviewId}, {isDeleted:true}]})
    if(reviewDeleteCheck.length>0){ return res.status(404).send({status:false,message:"Review is deleted already"})}
    

    const review = await reviewModel.findOneAndUpdate({_id:reviewId},{ $set:{isDeleted:true}}, { new: true })

    const bookReview = await bookModel.findOneAndUpdate({_id:bookId}, {$inc:{reviews:-1}})

    res.status(200).send({status:true, data:review})

    
}


module.exports ={
    createReview,
    updateReview,
    deleteReview}