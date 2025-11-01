// const axios = require("axios"); 

// const getLanguageById = (lang) =>
// {
//     const language = {

//         "c++":54,
//         "java":62,
//         "javascript":63
//     }

//     return language[lang.toLowerCase()];

// }
// // important
// const submitBatch = async (submissions) => {
//     const options = {
//         method: 'POST',
//         url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//         params: {
//             base64_encoded: 'false'
//         },
//         headers: {
//             'x-rapidapi-key': '56de8bb7b7mshf55462ac21350f8p1811b8jsnd1a34cefca59',
//             'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//             'Content-Type': 'application/json'
//         },
//         data: { submissions }
//     };

//     try {
//         const response = await axios.request(options);
//         return response.data.submissions; // ✅ this is the array of tokens
//     } catch (error) {
//         console.error("SubmitBatch error:", error.response?.data || error.message);
//         throw new Error("Judge0 Batch Submission Failed");
//     }
// };

// const waiting = async (time)=>{

//     setTimeout(()=>{
//         return 1;
//     },time);
// }
// const submitToken = async (resultToken) => {
//     const options = {
//         method: 'GET',
//         url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//         params: {
//             tokens: resultToken.join(","),
//             base64_encoded: 'false',
//             fields: '*'
//         },
//         headers: {
//             'x-rapidapi-key': '56de8bb7b7mshf55462ac21350f8p1811b8jsnd1a34cefca59',
//             'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//         }
//     };

//     let attempts = 0;
//     while (attempts < 5) {
//         try {
//             const response = await axios.request(options);
//             const result = response.data;

//             const allReady = result.submissions.every(r => r.status_id > 2);
//             if (allReady) {
//                 return result.submissions;
//             }

//             await wait(1500); // Wait and retry
//             attempts++;
//         } catch (error) {
//             console.error("SubmitToken error:", error.response?.data || error.message);
//             throw new Error("Failed to fetch Judge0 token results");
//         }
//     }

//     throw new Error("Timed out waiting for Judge0 submissions to complete");
// };

// module.exports = {getLanguageById,submitBatch,submitToken};

const axios = require("axios");

const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: { base64_encoded: 'false' },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: { submissions }
    };

    try {
        const response = await axios.request(options);
        console.log("🟢 Judge0 full response:", response.data);

        // ✅ response.data is the array of token objects already
        return response.data;
    } catch (error) {
        console.error("submitBatch error:", error.response?.data || error.message);
        throw new Error("Judge0 Batch Submission Failed");
    }
};



const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const result = response.data;

        const isDone = result.submissions.every((r) => r.status_id > 2);

        if (isDone) {
            return result.submissions;
        }

        // Wait and retry once (simple retry logic)
        await new Promise(resolve => setTimeout(resolve, 1500));
        return await submitToken(resultToken);  // recursive retry

    } catch (error) {
        console.error("submitToken error:", error.response?.data || error.message);
        throw new Error("Error fetching Judge0 result");
    }
};


module.exports = { getLanguageById, submitBatch, submitToken };




