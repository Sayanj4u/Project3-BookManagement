const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";
const mongoose = require("mongoose");

const bookModel = require("../models/bookModel");

const checkReview = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["X-api-key"];
    if (!token) {
      return res
        .status(401)
        .send({ status: false, message: "token must be present" });
    }

    try {
      var decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return res
        .status(401)
        .send({ status: false, message: "invalid token or token expired" });
    }

   
    const book = req.params.bookId;

//BookId Validation

    if (!book) {
      return res
        .status(400)
        .send({ status: false, message: "Book Id from  Params should be Present" });
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
      return res
        .status(404)
        .send({
          status: false,
          message: "We Can't Write Review On Deleted Books",
        });
    }

// Autherization on review and isDeleted in Collection  

    // const reqBookId = books.userId.toString();

    // if (reqBookId !== decoded.userId) {
    //   return res
    //     .status(403)
    //     .send({ status: false, message: "This  User Is Not Authorized To Give the " });
    // }

    next();
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

module.exports = { checkReview };
