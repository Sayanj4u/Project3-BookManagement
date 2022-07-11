const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const validator = require("../validator/validator");



//-----------------------------------Review Creation----------------------------------------------------------------

const createReview = async function (req, res) {
    try{
  const data = req.body;
  const book = req.params.bookId;
 var {reviewedBy,rating,review}=data // Destructing 

 // rating , reviwedBy,review

 if (!validator.isValidUserDetails(reviewedBy)) {
    return res
      .status(400)
      .send({ status: false, message: "please enter valid reviewers Name" });
  }
   
      if (rating) {
        if (
          !/^[+]?([1-4]*\.[0-9]+|[1-5])$/.test(
            rating
          )
        )
          return res.status(400).send({
            status: false,
            message: "Rating Should be from 1 to 5 ",
          })}
          else{
            return res.status(400).send({status:false,message:"rating  is Required"})
          }

   if(review||review===""){

    if (!validator.isValidUserDetails(review)) {
        return res.status(400).send({ status: false, message: "Invalid review" });
      }
}


     data["bookId"]=book

  const reviews = await reviewModel.create(data)
 
  const bookReview = await bookModel.findOneAndUpdate(
    { _id: book },
    { $inc: { reviews: 1 } }
  );
  res
    .status(201)
    .send({
      status: true,
      message: "Review Created Successfully",
      data: reviews,
    });
}
catch(error){
    return res.status(500).send({status:false,error:error.message})
}}


//-----------------------------------Update Review ----------------------------------------------------------------

const updateReview = async function (req, res) {
  const data = req.body;
  if (Object.keys(data).length === 0) {
    return res
      .status(400)
      .send({ status: false, message: "body couldnot be empty" });
  }
  const reviewId = req.params.reviewId;
  const review = await reviewModel.findOneAndUpdate(
    { _id: reviewId },
    { $set: data },
    { new: true }
  );
  res.status(200).send({ status: true, data: review });
};

const deleteReview = async function (req, res) {
  const review = await reviewModel.findOneAndUpdate(
    { _id: reviewId },
    { $set: { isDeleted: true } },
    { new: true }
  );

  const bookReview = await bookModel.findOneAndUpdate(
    { _id: bookId },
    { $inc: { reviews: -1 } }
  );

  res.status(200).send({ status: true, data: review });
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
}
