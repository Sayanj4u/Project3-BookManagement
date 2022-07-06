const jwt = require('jsonwebtoken')
const secretKey = "Functionup-Radon"

const loginCheck = async function(req, res, next) {
        try {
        

            let token = req.headers['x-api-key'] || req.headers['X-api-key']
            if (!token) {
                return res.status(403).send({ status: false, message: "token must be present" })
            }


            let decoded = jwt.verify(token, secretKey,{ignoreExpiration:true})
             
            if (Date.now()>decoded.exp*1000) {
                return res.status(401).send({ status: false, message: "token is expired" })
            }

            if(req.body.userId !== decoded.userId){
                return res.status(400).send({status:false, msg:"Login user is different"})
            }
            next()
        } catch (error) {
            res.status(500).send({ status: false, Error: "Provide Valid token" })
        }
    }
module.exports = {loginCheck}