const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../Middleware/adminMiddleware");
const userMiddleware = require("../Middleware/userMiddleware");
const {createProblem,updateProblem,deleteProblem,getproblemById,getAllProblem,solvedAllProblembyUser} = require("../controllers/userProblem");
//create (Required admin permission)


problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


//fetch
problemRouter.get("/problemById/:id",userMiddleware,getproblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);


module.exports = problemRouter;