const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const validator = require("../validator/validator");



//-----------------------------------Review Creation----------------------------------------------------------------

const createReview = async function (req, res) {
    try{
  var data = req.body;
  const book = req.params.bookId;
 var {reviewedBy,rating,review}=data // Destructing 



 // rating , reviwedBy,review
 if(reviewedBy||reviewedBy===""){
    if (!validator.isValidUserDetails(reviewedBy)) {
        return res.status(400).send({ status: false, message: "please enter valid reviewers Name" });
      }
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
  const {reviewId,bookId} = req.params
  const {review,rating,reviewedBy}=data // destructing details
  
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

      if(review||review===""){

        if (!validator.isValidUserDetails(review)) {
            return res.status(400).send({ status: false, message: "Invalid review" });
          }
    }

    if(reviewedBy||reviewedBy===""){
        if (!validator.isValidUserDetails(reviewedBy)) {
            return res.status(400).send({ status: false, message: "please enter valid reviewers Name" });
          }
        }

  const UpdateReview = await reviewModel.findOneAndUpdate(
    { _id: reviewId },
    { $set: data },
    { new: true }
  );

  const reviews = await reviewModel.find({ bookId: bookId }).select({_id:1,bookId:1,reviewedBy:1,reviewedAt:1,rating:1, review:1})

  const book = await bookModel.findOne({$and:[{ _id: bookId,isDeleted:false }]}).select({ISBN:0,__v:0,deletedAt:0})

  book._doc.reviewsData=reviews


  res.status(200).send({ status: true, message:"Books list", data: book });
};




//-----------------------------------Delete Review ----------------------------------------------------------------



const deleteReview = async function (req, res) {
    const data = req.body;
  const {reviewId,bookId} = req.params

  const DeleteReview = await reviewModel.findOneAndUpdate(
    { _id: reviewId },
    { $set: { isDeleted: true } },
    { new: true }
  );
  const bookReview = await bookModel.findOneAndUpdate(
    { _id: bookId },
    { $inc: { reviews: -1 } }
  );

  res.status(200).send({ status: true, data: DeleteReview});
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
}
