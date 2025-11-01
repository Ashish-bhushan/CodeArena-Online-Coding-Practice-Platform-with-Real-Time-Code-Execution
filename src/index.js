const express = require("express");
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
// ✅ Middleware must come BEFORE routes
app.use(express.json()); // parse JSON bodies
app.use(cookieParser());

// ✅ Mount router
app.use('/user', authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);

const InitalizeConnection =async ()=>
{
    try
    {
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB CONNECTED");
        app.listen(process.env.PORT, () => 
        {
            console.log("Server listening at PORT number: " + process.env.PORT);
        });
    }
    catch(err)
    {
        console.log("Error : "+err.message);
    }
}
InitalizeConnection();






// ✅ Test route
app.get("/info", (req, res) => {
    res.send("Hello, let's start building");
});
