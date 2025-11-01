const {getLanguageById,submitBatch,submitToken}= require("../utils/ProblemUtility");
const Problem = require("../models/problem");
const createProblem = async (req,res)=>
{
    const {title,description,difficulty,tags,
        visibleTestCases,HiddenTestCases
        ,startCode,referenceSolution,problemCreater} = req.body;

        try
        {
            for(const {language,CompleteCode} of referenceSolution)
            {
                //source_code
                // language_id
                // stdin
                //expectedOutput

                const languageId = getLanguageById(language);
                // creating Batch submission
                const submissions = visibleTestCases.map((testcase) => ({
                    source_code: CompleteCode,
                    language_id: languageId, // ✅ HERE
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }));

                // console.log("📦 Submissions Payload:", submissions);
                //submite batch
                const submitResult = await submitBatch(submissions);
                // console.log(submitResult);
                if (!submitResult || !Array.isArray(submitResult)) {
                        return res.status(500).send("Judge0 response invalid or empty.");
                    }

                const resultToken = submitResult.map((value) => value.token);

                const testResult = await submitToken(resultToken);
                // console.log(testResult);
                for(const test of testResult)
                {
                    if(test.status_id!=3)
                    {
                      return res.status(400).send("Error Occured");
                    }
                }
            }

            // sab sahi hai
            // we can store in our db
            const userProblem = await Problem.create({
                ...req.body,
                problemCreater: req.result._id
            });
            res.status(201).send("Problem Saved Successfully ✅")
             
        }
        catch(err)
        {
            res.send("ERR-message from  createproblem"+err.message);
        }
}

const updateProblem = async (req,res) =>
{
    const {id} = req.params;
    try
    {
        const {title,description,difficulty,tags,
        visibleTestCases,HiddenTestCases
        ,startCode,referenceSolution,problemCreater} = req.body;

        // agar  id  nahi aayi ho ya undefine ho
        if(!id)
        {
           return res.status(400).send("Invalid ID field");
        }
        const Dsaproblem = await Problem.findById(id);
        if(!Dsaproblem)
        {
            return res.status(404).send("ID is not present in server");
        }
        //
        for(const {language,CompleteCode} of referenceSolution)
            {
                //source_code
                // language_id
                // stdin
                //expectedOutput

                const languageId = getLanguageById(language);
                // creating Batch submission
                const submissions = visibleTestCases.map((testcase) => ({
                    source_code: CompleteCode,
                    language_id: languageId, // ✅ HERE
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }));

                // console.log("📦 Submissions Payload:", submissions);
                //submite batch
                const submitResult = await submitBatch(submissions);
                // console.log(submitResult);
                if (!submitResult || !Array.isArray(submitResult)) {
                        return res.status(500).send("Judge0 response invalid or empty.");
                    }

                const resultToken = submitResult.map((value) => value.token);

                const testResult = await submitToken(resultToken);
                // console.log(testResult);
                for(const test of testResult)
                {
                    if(test.status_id!=3)
                    {
                      return res.status(400).send("Error Occured");
                    }
                }
            }

        const newProblem = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
        res.status(200).send(newProblem);
    }
    catch(err)
    {
        res.status(500).send("Error in update section :"+err.message);
    }
} 


const deleteProblem = async (req,res) =>
{
    const {id} = req.params;
    try
    {
        // agar  id  nahi aayi ho ya undefine ho
        if(!id)
        {
           return res.status(400).send("Invalid ID field/ID is Missing");
        }
        const deleteProblem =await Problem.findByIdAndDelete(id);
        if(!deleteProblem)
        {
            res.status(404).send("Problem is Missing");
        }
        res.status(200).send("Succesfully Deleted");
    }
    catch(err)
    {
        res.status(404).send("Error in delete section :"+err.message);
    }
}


const getproblemById = async (req,res) =>
{
    const {id} = req.params;
    try
    {
        // agar  id  nahi aayi ho ya undefine ho
        if(!id)
        {
           return res.status(400).send("Invalid ID field/ID is Missing");
        }
        const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');
        if(!getProblem)
        {
            return res.status(404).send("Problem is Missing");
        }
        res.status(200).send(getProblem);
    }
    catch(err)
    {
        res.status(404).send("Error with Problem :"+err.message);
    }
}
const getAllProblem = async (req, res) => {
    try {
        const problems = await Problem.find({}).select('_id title difficulty tags'); // Await the DB call

        if (!problems || problems.length === 0) {
            return res.status(404).send("No problems found");
        }

        res.status(200).json(problems); // Send JSON response
    } catch (err) {
        res.status(500).send("Error fetching problems: " + err.message);
    }
};

const solvedAllProblembyUser =  async (req,res)=>
{
    try
    {
        const count = req.result.problemSolved.length;
        res.status(200).send(count);
    }
    catch(err)
    {
        res.status(500).send("Server error "+err.message);
    }
}
module.exports = {createProblem, updateProblem,deleteProblem,getproblemById,getAllProblem,solvedAllProblembyUser};