const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");
const User = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware = async (req,res,next)=>
{
    try
    {
        const {token} = req.cookies;
        if(!token)
        {
            throw new Error("Token is not persent");
        }
        const payload = jwt.verify(token,process.env.JWT_KEY);
        const{_id} = payload;
        if(!_id)
        {
            throw new Error("Invalid token")
        }
        const result = await User.findById(_id);
        if(!result)
        {
             throw new Error("user doesn't Exits");
        }
        // Redis ke blocklist me present toh nahi hai

        const Isblocked = await redisClient.exists(`token:${token}`);
        if(Isblocked)
        {
            throw new Error("Invalid Token");
        }
        req.result = result;
        next();

    }
    catch(err)
    {
       res.status(401).send("Error : "+err.message);
    }
}
module.exports = userMiddleware;