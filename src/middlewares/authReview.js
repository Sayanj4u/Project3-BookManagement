const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";
const mongoose = require("mongoose")

const bookModel = require("../models/bookModel")


const checkReview = async function (req, res, next) {
    try {

        let requestBody = req.body;

        if (Object.keys(requestBody).length === 0) {
            return res.status(400).send({ status: false, message: "body couldnot be empty" })
        }

        let token = req.headers["x-api-key"] || req.headers["X-api-key"];
        if (!token) {
            return res
                .status(403)
                .send({ status: false, message: "token must be present" });
        }

        let decoded = jwt.verify(token, secretKey, { ignoreExpiration: true });


        if (Date.now() > decoded.exp * 1000) {
            return res
                .status(401)
                .send({ status: false, message: "token is expired" });
        }

        let bookId = req.body.bookId

        const book = req.params.bookId
        if (bookId != book) { return res.status(400).send({ status: false, message: "Both Book Ids should be same" }) }
        if (!mongoose.isValidObjectId(book)) {
            return res.status(400).send({ status: false, messege: "bookId is Invalid" });
        }

        const books = await bookModel.findById({ _id: book })
        if (!books) { return res.status(404).send({ status: false, message: "No such book found with this Id" }) }


        const checkDelete = await bookModel.findById({ _id: book })
        if (checkDelete.isDeleted === true) { return res.status(404).send({ status: false, message: "Book is already Deleted" }) }




        const reqBookId = checkDelete.userId.toString()

        if (reqBookId !== decoded.userId) {
            return res
                .status(400)
                .send({ status: false, message: "Login user is different" });
        }
        next();
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }
};

module.exports = { checkReview };
