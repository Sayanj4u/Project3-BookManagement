const mongoose = require("mongoose")
const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

const createReview = async function(req,res){
    const data = req.body

    const book = req.params.bookId
      if(req.body.bookId != book){ return res.status(400).send({status:false, message:"Both Book Ids should be same"}) }
        if(!mongoose.isValidObjectId(book)){
            return res.status(400).send({ status: false, messege: "bookId is Invalid" });
        }
    
        const books = await bookModel.findById({_id:book})
        if(!books){ return res.status(404).send({status:false,message:"No such book found with this Id"})}
    
    
        const checkDelete = await bookModel.findById({_id:book})
        if(checkDelete.isDeleted===true){ return res.status(404).send({status:false,message: "Book is already Deleted"})}
    

    const review = await reviewModel.create(data)

    res.status(201).send({status:true,message:"Review Created Successfully", data:review})
}

module.exports ={createReview}