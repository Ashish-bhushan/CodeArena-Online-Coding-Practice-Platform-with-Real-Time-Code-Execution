const Problem = require("../models/problem");
const Submission = require("../models/submission");

const {getLanguageById,submitBatch,submitToken} = require("../utils/ProblemUtility")
const submitCode = async (req,res)=>
{
    try
    {
        const userId = req.result._id;
        const problemId = req.params.id;
        const {code,language} = req.body;

        // validate kar leta hu
        if(!userId || !problemId || !code || !language)
        {
            return res.status(400).send("Some Field is Missing");
        }
        // fetch the problem from database
        const problem = await Problem.findById(problemId);
        // submission ko pahle database me store karunga pahle
        const submittedResult =await Submission.create({

            userId,
            problemId,
            code,
            language,
            testCasesPassed:0,
            status:'pending',
            testCasesTotal:problem.HiddenTestCases.length
        })

        // jugde0 code ko submit karna hai
        const languageId = getLanguageById(language);

        const submissions = problem.HiddenTestCases.map((testcase) => ({
                    source_code: code,
                    language_id: languageId, // ✅ HERE
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }));

        const submitResult = await submitBatch(submissions);
        if (!submitResult || !Array.isArray(submitResult)) {
                return res.status(500).send("Judge0 response invalid or empty.");
            }
        
        const resultToken = submitResult.map((value) => value.token);
        
        const testResult = await submitToken(resultToken);

        // submittedResult ko update karunag
        let testCasesPassed = 0;
        let runtime=0;
        let memory=0;
        let status = "Accepted";
        let errorMessage = null;
        for(const test of testResult)
        {
                if(test.status_id==3)
                {
                    testCasesPassed++;
                    runtime = runtime + parseFloat(test.time);
                    memory = Math.max(memory,test.memory);
                }
                else
                {
                    if(test.status_id==4)
                    {
                        status = 'Error'
                        errorMessage = test.stderr;
                    }
                    else
                    {
                        status = 'Wrong'
                        errorMessage = test.stderr;
                    }
                }
        }
        // store the result in database in submittion
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
// kya user ne ye problem already solve kardiya hai kya (unique)
// problemId ko insert karenge userSchema ke problemSolved mein if it is not persent
        if(!req.result.problemSolved.includes(problemId))
        {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }



        // await submittedResult.save();
        res.status(201).send(submittedResult);

    }
    catch(err)
    {
        res.status(500).send("Internal Server error "+ err.message);
    }
}

module.exports = submitCode;