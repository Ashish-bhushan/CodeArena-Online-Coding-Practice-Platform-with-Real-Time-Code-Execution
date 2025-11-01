const { Error } = require("mongoose");
const user = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const register = async (req,res)=>
{
    try
    {
       
        // validate the data
        validate(req.body);
        const {firstName,emailId,password} = req.body;

        req.body.password = await bcrypt.hash(password,10);
        req.body.role = "user";

        
        const newuser = await user.create(req.body);
        const token  = await jwt.sign({_id:newuser._id,emailId,role:"user"},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("✅ User Registed Succesfully")
    }
    catch(err)
    {
        res.status(400).send("Error : "+err);
    }
}

const login = async (req,res)=>
{
    try
    {
        const {emailId,password} = req.body;
        if(!emailId)
        {
            throw new Error("Invalid Credential");
        }
        if(!password)
        {
            throw new Error("Invalid Credential");
        }
        // find and return user data based on email
        const user_data = await user.findOne({emailId});
        // check password is correct(stored data)
       const match = await bcrypt.compare(password,user_data.password);
       if(!match)
       {
        throw new Error("Invalid Credentials");
       }
        const token  = await jwt.sign({_id:user_data._id,emailId,role:user_data.role},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).send("Logged In Successfully");
        // console.log(req.body);  { emailId: 'SHYAM@gmail.com', password: 'SHYAM.7&7r6_%' }
    }
    catch(err)
    {
        res.status(401).send("Error : "+err);
    }
}

const logout = async(req,res)=>
{
     try {
        // ✅ Get token from cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("No token found");
        }

        // ✅ Decode token (don't verify, just decode)
        const payload = jwt.decode(token);
        if (!payload || !payload.exp) {
            return res.status(400).send("Invalid token");
        }

        // ✅ Add token to Redis blocklist
        await redisClient.set(`token:${token}`, 'Blocked');
        // Redis expects expiry in seconds since epoch
        await redisClient.expireAt(`token:${token}`, payload.exp);

        // ✅ Clear cookie
        res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

        res.send("Logged Out Successfully");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }

}

const adminRegister = async (req,res)=>
{
    try
    {
        // validate the data
        validate(req.body);
        const {firstName,emailId,password} = req.body;

        req.body.password = await bcrypt.hash(password,10);
        req.body.role = "admin";

        
        const newuser = await user.create(req.body);
        const token  = await jwt.sign({_id:newuser._id,emailId,role:"admin"},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("✅ Admin Registed Succesfully")
    }
    catch(err)
    {
        res.status(400).send("Error : "+err);
    }

}

module.exports = {register,login,logout,adminRegister};