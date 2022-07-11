const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const MW = require("../middlewares/auth");
const MW2 = require("../middlewares/authForBookId");
const MW3 = require("../middlewares/authReview");
const MW4 = require("../middlewares/authUpdateReview");

//*-----------------------------------User Creation----------------------------------------------------------------

router.post("/register", MW.BodyValidation, userController.createUser);

//*-----------------------------------Book Creation----------------------------------------------------------------
router.post(
  "/books",
  MW.BodyValidation,
  MW.loginCheck,
  bookController.createBook
);

//*-----------------------------------**User Login**----------------------------------------------------------------

router.post("/login", MW.BodyValidation, userController.loginUser); //

//*-----------------------------------GetBooks And Filters----------------------------------------------------------------

router.get("/books", bookController.getBooks);

//*-----------------------------------GetBooksById----------------------------------------------------------------

router.get("/books/:bookId", bookController.getBooksById);

//*-----------------------------------UpdateBooksById----------------------------------------------------------------

router.put(
  "/books/:bookId",
  MW.BodyValidation,
  MW2.authCheck,
  bookController.updateBookById
);

//*-----------------------------------DeleteBookById----------------------------------------------------------------

router.delete("/books/:bookId", MW2.authCheck, bookController.deleteByBookId);

//*-----------------------------------Review Creation----------------------------------------------------------------

router.post(
  "/books/:bookId/review",
  MW.BodyValidation,
  MW3.checkReview,
  reviewController.createReview
);  // token invalid and token expire

//*-----------------------------------Update Review ----------------------------------------------------------------

router.put(
  "/books/:bookId/review/:reviewId",
  MW.BodyValidation,
  MW4.updateCheckReview,
  reviewController.updateReview
);

//*-----------------------------------Delete Review ----------------------------------------------------------------

router.delete(
  "/books/:bookId/review/:reviewId",
  MW4.updateCheckReview,
  reviewController.deleteReview
);

module.exports = router;


//*-----------------------------------*Completed*----------------------------------------------------------------
