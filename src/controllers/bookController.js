const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator")
const mongoose = require("mongoose")


const createBook = async function(req,res){

    let requestBody = req.body;

    if (!validator.isValidRequestBody(requestBody)) {
        return res.status(400).send({
            status: false,
            messege: "Please provide book details",
        });
    }
    // extract parameters
    const { title,excerpt,userId,ISBN,category,subcategory,releasedAt} = requestBody; //destructuring 
    if (!validator.isValid(title)) {
        return res.status(400).send({ status: false, messege: "Title is required" });
    }
    if(!validator.isValidTitle(title)){
        return res.status(400).send({ status: false, messege: "Invalid title" });
    }
    const titl = await bookModel.findOne({title:title})
    if(titl){
        return res.status(400).send({ status: false, messege: "Title is already present" });
    }


    if (!validator.isValid(excerpt)) {
        return res.status(400).send({ status: false, messege: "excerpt is required" });
    }


    if (!validator.isValid(userId)) {
        return res.status(400).send({ status: false, messege: "userId is required" });
    }
   if(!mongoose.isValidObjectId(userId)){
    return res.status(400).send({ status: false, messege: "userId is Invalid" });
   }
    const uId = await userModel.findById({_id:userId})
    if(!uId){
        return res.status(404).send({status:false, msg:"no user found with this ID"})
    }



    if (!validator.isValid(ISBN)) {
        return res.status(400).send({ status: false, messege: "ISBN is required" });
    }
    if(!validator.isValidIsbn(ISBN)){return res.status(400).send({status:false, msg:"Invalid ISBN"})}//TA QUESTIONS
    const isbn = await bookModel.findOne({ISBN: ISBN})
    if(isbn){return res.status(400).send({status:false,msg:"Duplicate ISBN"})}


    if (!validator.isValid(category)) {
        return res.status(400).send({ status: false, messege: "category is required" });
    }
    if (!validator.isValid(subcategory)) {
        return res.status(400).send({ status: false, messege: "subcategory is required" });
    }
    if (!validator.isValid(releasedAt)) {
        return res.status(400).send({ status: false, messege: "releasedAt is required" });
    }

    const book= await bookModel.create(requestBody)

    res.status(201).send({status:true,message: "Book created successfully",data:book})

}
module.exports={createBook};