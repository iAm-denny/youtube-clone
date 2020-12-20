const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorization = async (req,res,next) => {
    try {
        const token = req.header("authorization")

        if(!token) {
            return res.status(403).json('User not authorization')
        }
        const jwtVerify = jwt.verify(token, process.env.JWT_SECRET)
        req.user_id = jwtVerify.user_id
        next()
    }
    catch(err) {
        console.log(err)
        return res.status(403).json("You're not authorize")

    }
}
module.exports = authorization