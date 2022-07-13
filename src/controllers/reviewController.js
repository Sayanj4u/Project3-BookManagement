const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const validator = require("../validator/validator");
const mongoose = require("mongoose");

//*-----------------------------------Review Creation----------------------------------------------------------------

const createReview = async function (req, res) {
  try {
    var data = req.body;
    const book = req.params.bookId;
    var { reviewedBy, rating, review, bookId, reviewedAt } = data; // Destructing
    const array = Object.keys(data);

    if (array.length > 3 || array.includes("bookId")) {
      return res.status(400).send({
        status: false,
        message:
          "body may only consist reviewedBy,rating,review or either one of them",
      });
    }
    if (array.includes("reviewedAt")) {
      return res.status(400).send({
        status: false,
        message:
          "body may only consist reviewedBy,rating,review or either one of them",
      });
    }

    if (!book) {
      return res.status(400).send({
        status: false,
        message: "Book Id from  Params should be Present",
      });
    }

    if (!mongoose.isValidObjectId(book)) {
      return res
        .status(400)
        .send({ status: false, messege: "bookId is Invalid" });
    }

    const books = await bookModel.findById({ _id: book });
    if (!books) {
      return res
        .status(404)
        .send({ status: false, message: "No such book found with this Id" });
    }

    if (books.isDeleted === true) {
      return res.status(404).send({
        status: false,
        message: "We Can't Write Review On Deleted Books",
      });
    }

    //*---------------------------body Validation-------------------------

    if (reviewedBy || reviewedBy === "") {
      if (!validator.isValidUserDetails(reviewedBy)) {
        return res.status(400).send({
          status: false,
          message: "please enter valid reviewers Name",
        });
      }
    }
    if (rating) {
      if (!/^[+]?([1-4]*\.[0-9]+|[1-5])$/.test(rating))
        return res.status(400).send({
          status: false,
          message: "Rating Should be from 1 to 5 ",
        });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "rating  is Required" });
    }

    if (review || review === "") {
      if (!validator.isValidUserDetails(review)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid review" });
      }
    }

    data["bookId"] = book;
    
    data["reviewedAt"] = Date.now();

    const reviews = await reviewModel.create(data);

    const bookReview = await bookModel
      .findOneAndUpdate({ _id: book }, { $inc: { reviews: 1 } }, { new: true })
      .select({ ISBN: 0, __v: 0, deletedAt: 0 });
    const reviewData = await reviewModel.find({ _id: reviews._id }).select({
      _id: 1,
      bookId: 1,
      reviewedBy: 1,
      reviewedAt: 1,
      rating: 1,
      review: 1,
    });

    bookReview._doc.reviewsData = reviewData;

    res
      .status(200)
      .send({ status: true, message: "Books list", data: bookReview });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//*-----------------------------------Update Review ----------------------------------------------------------------

const updateReview = async function (req, res) {
  try {
    const data = req.body;
    const { reviewId, bookId } = req.params;
    const { review, rating, reviewedBy } = data; // destructing details

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
      return res.status(404).send({
        status: false,
        message: "We Can't Update The reviews Of  Deleted Book",
      });
    }

    if (!mongoose.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, messege: "reviewId is Invalid" });
    }

    const reviewCheck = await reviewModel.findById({ _id: reviewId });
    if (!reviewCheck) {
      return res
        .status(404)
        .send({ status: false, message: "No such Review found with this Id" });
    }

    if (books._id.toString() !== reviewCheck.bookId.toString()) {
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

    if (rating) {
      if (!/^[+]?([1-4]*\.[0-9]+|[1-5])$/.test(rating))
        return res.status(400).send({
          status: false,
          message: "Rating Should be from 1 to 5 ",
        });
    }

    if (review || review === "") {
      if (!validator.isValidUserDetails(review)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid review" });
      }
    }

    if (reviewedBy || reviewedBy === "") {
      if (!validator.isValidUserDetails(reviewedBy)) {
        return res.status(400).send({
          status: false,
          message: "please enter valid reviewers Name",
        });
      }
    }

    const UpdateReview = await reviewModel
      .findOneAndUpdate({ _id: reviewId }, { $set: data }, { new: true })
      .select({
        _id: 1,
        bookId: 1,
        reviewedBy: 1,
        reviewedAt: 1,
        rating: 1,
        review: 1,
      });

    const book = await bookModel
      .findOne({ $and: [{ _id: bookId, isDeleted: false }] })
      .select({ ISBN: 0, __v: 0, deletedAt: 0 });

    book._doc.reviewsData = UpdateReview;
    // console.log(reviews.length)
    res.status(200).send({ status: true, message: "Books list", data: book });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//*-----------------------------------Delete Review ----------------------------------------------------------------

const deleteReview = async function (req, res) {
  try {
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
      return res.status(404).send({
        status: false,
        message: "We Can't Update The reviews Of  Deleted Book",
      });
    }

    if (!mongoose.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .send({ status: false, messege: "reviewId is Invalid" });
    }

    const reviewCheck = await reviewModel.findById({ _id: reviewId });
    if (!reviewCheck) {
      return res
        .status(404)
        .send({ status: false, message: "No such Review found with this Id" });
    }

    if (books._id.toString() !== reviewCheck.bookId.toString()) {
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

    const DeleteReview = await reviewModel.findOneAndUpdate(
      { _id: reviewId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    const bookReview = await bookModel.findOneAndUpdate(
      { _id: bookId },
      { $inc: { reviews: -1 } },
      { new: true }
    );

    res.status(200).send({ status: true, message: "Review Deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
