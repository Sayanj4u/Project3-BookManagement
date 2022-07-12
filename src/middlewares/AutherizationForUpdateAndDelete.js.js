const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");

const authCheck = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    let decoded = jwt.verify(token, secretKey);
    const book = req.params.bookId;
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

    const checkDelete = await bookModel.findById({ _id: book });
    if (checkDelete.isDeleted === true) {
      return res
        .status(404)
        .send({
          status: false,
          message: "Book is already Deleted Unable to Update",
        });
    }

    const bookid = await bookModel.findById({ _id: book });

    let logiUserId = bookid.userId.toString();
    if (logiUserId !== decoded.userId) {
      return res
        .status(403)
        .send({
          status: false,
          msg: "Login User Has not Access To Perform This Action",
        });
    }
    next();
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

module.exports = { authCheck };
