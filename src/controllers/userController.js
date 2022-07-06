const userModel = require("../models/userModel")

const createUser =async function(req,res){
    let body = req.body
    const registerUser= await userModel.create(body)

    res.status(201).send({status:true,message: "user created successfully",data:registerUser})
}
module.exports= {createUser}