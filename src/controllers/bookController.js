const bookModel = require("../models/bookModel");
const validator = require("../validator/validator");
const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const secretKey = "Functionup-Radon";
const jwt = require("jsonwebtoken");

//*-----------------------------------Book Creation----------------------------------------------------------------

const createBook = async function (req, res) {
  try {
    let requestBody = req.body;

    // extract parameters

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      requestBody; //destructuring

    //title validation

    if (!validator.isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    }

    if (!validator.isValidUserDetails(title)) {
      return res.status(400).send({ status: false, message: "Invalid title" });
    }
 
    // title unique checking

    const titl = await bookModel.findOne({ title: title });
    if (titl) {
      return res
        .status(400)
        .send({ status: false, message: `Title ${title} is already present` });
    }

    //excerpt Validation

    if (!validator.isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "excerpt is required" });
    }
    if (!validator.isValidUserDetails(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid excerpt" });
    }

    //ISBN Validation

    if (!validator.isValid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN is required" });
    }
    if (!validator.isValidIsbn(ISBN)) {
      return res.status(400).send({ status: false, message: "Invalid ISBN" });
    }

    //ISBN unique check

    const isbn = await bookModel.findOne({ ISBN: ISBN });
    if (isbn) {
      return res.status(400).send({ status: false, message: "Duplicate ISBN" });
    }

    //Category Validation

    if (!validator.isValid(category)) {
      return res
        .status(400)
        .send({ status: false, message: "category is required" });
    }
    if (!validator.isValidUserDetails(category)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid category" });
    }

    //validating subCategory is entered and validation for Array of strings

    if (
      typeof subcategory === "undefined" ||
      subcategory === null ||
      subcategory.length == 0
    ) {
      return res.status(400).send({
        status: false,
        message: "please enter subcategory key or valid subcategory",
      });
    }
    if (subcategory) {
      if (typeof subcategory === "string" || typeof subcategory === "object") {
        for (let i = 0; i < subcategory.length; i++) {
          if (subcategory[i] == 0) {
            return res.status(400).send({
              status: false,
              message: "subcategory should have atleast one alpha",
            });
          }

          if (!/^([a-zA-Z]+)$/.test(subcategory[i])) {
            return res.status(400).send({
              status: false,
              message: " enter valid subcategory in alphabets only",
            });
          }
        }
      } else {
        return res.status(400).send({
          status: false,
          message: " enter valid subcategory in string or [] only",
        });
      }
    }

    // ReleasedAt Validation

    if (releasedAt) {
      if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt))
        return res.status(400).send({
          status: false,
          message: "Date format should be in YYYY-MM-DD for releasedAt",
        });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "ReleasedAt is required" });
    }

    const book = await bookModel.create(requestBody);

    res.status(201).send({
      status: true,
      message: "Success",
      data: book,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//*-----------------------------------GetBooks----------------------------------------------------------------

const getBooks = async function (req, res) {
  try {
    const query = req.query;
    const filter = {};
    filter.isDeleted = false;

    if (query.userId) {
      if (!mongoose.isValidObjectId(query.userId)) {
        return res
          .status(400)
          .send({ status: false, message: "UserId is Invalid" });
      } else {
        filter.userId = query.userId;
      }
    }
    if (query.category) {
      filter.category = query.category;
    }
    if (query.subcategory) {
      filter.subcategory = query.subcategory;
    }
    const book = await bookModel.find(filter).sort({ title: 1 }).select({
      _id: 1,
      title: 1,
      excerpt: 1,
      userId: 1,
      category: 1,
      releasedAt: 1,
      reviews: 1,
    });
    if (book.length === 0) {
      return res.status(404).send({ status: false, message: "No Books Found" });
    }
    res
      .status(200)
      .send({ status: true, message: "Books list", data: book });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//*-----------------------------------GetBooksById----------------------------------------------------------------

const getBooksById = async function (req, res) {
  try {
    const bookId = req.params.bookId;

    if (!mongoose.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is Invalid" });
    }
    
    const review = await reviewModel.find({ bookId: bookId }).select({
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

    if (!book) {
      return res
        .status(404)
        .send({ status: false, message: "No such book found with this Id" });
    }
    book._doc.reviewsData = review;
   
    res.status(200).send({ status: true, message: "Books list", data: book });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//*-----------------------------------UpdateBooksById----------------------------------------------------------------

const updateBookById = async function (req, res) {
  try {
    const book = req.params.bookId;
    const updateList = req.body;

    const updatedTitle = await bookModel.find({ title: updateList.title });
    if (updatedTitle.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${updateList.title} is  already present , use different title`});
    }

    const updateIsbn = await bookModel.find({ ISBN: updateList.ISBN });
    if (updateIsbn.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${updateList.ISBN} is  already present , use different ISBN` });
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: book },
      { $set: updateList },
      { new: true }
    );

    res.status(200).send({ status: true, message:"Success" ,data: updatedBook });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//*-----------------------------------DeleteBookById----------------------------------------------------------------

const deleteByBookId = async function (req, res) {
  try {
    const book = req.params.bookId;

    const deleteBook = await bookModel.findOneAndUpdate(
      { _id: book },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "Book Deleted Successfully",
      data: deleteBook,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBooksById,
  updateBookById,
  deleteByBookId,
};
