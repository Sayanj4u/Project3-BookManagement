const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";
const mongoose = require("mongoose");

const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

const updateCheckReview = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["X-api-key"];
    if (!token) {
      return res
        .status(401)
        .send({ status: false, message: "token must be present" });
    }
    try {
      let decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return res
        .status(401)
        .send({ status: false, message: "invalid token or token expired" });
    }

    const { reviewId, bookId } = req.params;

    if (!mongoose.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, messege: "bookId is Invalid" });
    }

    const BookById = await bookModel.findById({ _id: bookId });

    if (!BookById) {
      return res
        .status(404)
        .send({ status: false, message: "No such book found with this Id" });
    }

    const books = await bookModel.findOne({
      $and: [{ _id: bookId }, { isDeleted: false }],
    });

    if (!books) {
      return res
        .status(404)
        .send({
          status: false,
          message: "We Can't Update The reviews Of  Deleted Book",
        });
    }

    if (!mongoose.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, messege: "reviewId is Invalid" });
    }

    const review = await reviewModel.findById({ _id: reviewId });
    if (!review) {
      return res
        .status(404)
        .send({ status: false, message: "No such Review found with this Id" });
    }

    if (books._id.toString() !== review.bookId.toString()) {
      return res
        .status(400)
        .send({ status: false, message: "BookId is diiferent From User Id" });
    }

    const reviewDeleteCheck = await reviewModel.findOne({
      $and: [{ _id: reviewId }, { isDeleted: false }],
    });

    if (!reviewDeleteCheck) {
      return res
        .status(404)
        .send({ status: false, message: "Review is Deleted Unable to Update" });
    }

    try {
      var decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return res
        .status(401)
        .send({ status: false, message: "invalid token or token expired" });
    }

    let logiUserId = books.userId.toString();

    if (logiUserId !== decoded.userId) {
      return res
        .status(403)
        .send({
          status: false,
          msg: "Login User Has  No Access To Update The Review",
        });
    }
    next();
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

module.exports = { updateCheckReview };
