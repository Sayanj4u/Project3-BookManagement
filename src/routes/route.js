const express = require("express")
const router = express.Router()
const userController= require("../controllers/userController")
const bookController= require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const MW = require("../middlewares/auth")
const MW2 = require("../middlewares/authForBookId")
const MW3 = require("../middlewares/authReview")
const MW4 = require("../middlewares/authUpdateReview")



router.post('/register',MW.BodyValidation,userController.createUser)

router.post('/books',MW.BodyValidation, MW.loginCheck,bookController.createBook) // releasedAt validation , subcategory error handling , title scrict validation

router.post('/login',MW.BodyValidation,userController.loginUser) //

router.get('/books',bookController.getBooks)

router.get('/books/:bookId',bookController.getBooksById)

router.put('/books/:bookId',MW.BodyValidation,MW2.authCheck,bookController.updateBookById)

router.delete('/books/:bookId',MW2.authCheck,bookController.deleteByBookId)

router.post('/books/:bookId/review',MW.BodyValidation,MW3.checkReview,reviewController.createReview) // token invalid and token expire

router.put('/books/:bookId/review/:reviewId',MW.BodyValidation,MW4.updateCheckReview,reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId',MW4.updateCheckReview,reviewController.deleteReview)



module.exports=router;