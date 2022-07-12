const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controllers/userController");

const {
  createBook,
  getBooks,
  getBooksById,
  updateBookById,
  deleteByBookId,
} = require("../controllers/bookController");

const {
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  AuthenticationCheck,
  BodyValidation,
} = require("../middlewares/Authentication");

const { AuthorizationCheck } = require("../middlewares/Authorization");

const { authCheck } = require("../middlewares/AuthorizationForUpdateAndDelete.js");

//*-----------------------------------User Creation----------------------------------------------------------------

router.post("/register", BodyValidation, createUser);

//*-----------------------------------**User Login**----------------------------------------------------------------

router.post("/login", BodyValidation, loginUser); //

//*-----------------------------------Book Creation----------------------------------------------------------------

router.post(
  "/books",
  BodyValidation,
  AuthenticationCheck,
  AuthorizationCheck,
  createBook
);

//*-----------------------------------GetBooks And Filters----------------------------------------------------------------

router.get("/books", AuthenticationCheck, getBooks);

//*-----------------------------------GetBooksById----------------------------------------------------------------

router.get("/books/:bookId", AuthenticationCheck, getBooksById);

//*-----------------------------------UpdateBooksById----------------------------------------------------------------

router.put(
  "/books/:bookId",
  BodyValidation,
  AuthenticationCheck,
  authCheck,
  updateBookById
);

//*-----------------------------------DeleteBookById----------------------------------------------------------------

router.delete("/books/:bookId", AuthenticationCheck, authCheck, deleteByBookId);

//*-----------------------------------Review Creation----------------------------------------------------------------

router.post("/books/:bookId/review", BodyValidation, createReview); 

//*-----------------------------------Update Review ----------------------------------------------------------------

router.put("/books/:bookId/review/:reviewId", BodyValidation, updateReview);

//*-----------------------------------Delete Review ----------------------------------------------------------------

router.delete("/books/:bookId/review/:reviewId", deleteReview);





router.all("/**",function(req,res){
    return res.status(400).send({
        status:false,message:"the end point is not correct"
    })

})

module.exports = router;


//*-----------------------------------*Completed*----------------------------------------------------------------
