const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateJwt = (id) => {
    const user_id = id 
    const payload = {
        user_id
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7days" })
}

module.exports =  generateJwt