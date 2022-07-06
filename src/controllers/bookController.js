const bookModel = require("../models/bookModel");


const createBook = async function(req,res){
    let body = req.body
    const book= await bookModel.create(body)

    res.status(201).send({status:true,message: "Book created successfully",data:book})

}
module.exports={createBook};