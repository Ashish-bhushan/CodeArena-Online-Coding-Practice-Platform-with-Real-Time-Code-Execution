const express = require("express");
const authRouter = express.Router();
const { register, login, logout ,adminRegister} = require("../controllers/userAuthent");
const userMiddleware = require("../Middleware/userMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
//JSON middleware is already applied in index.js
// So i don't need app.use(express.json()) here

// Register routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
module.exports = authRouter;
