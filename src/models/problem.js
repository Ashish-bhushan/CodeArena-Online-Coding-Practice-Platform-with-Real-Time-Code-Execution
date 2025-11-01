const mongoose = require('mongoose');
const { Schema } = mongoose;


const problemSchema = new mongoose.Schema(
{
    title:{type:String,required:true},
    description:{type:String,required:true},
    difficulty:{type:String,required:true,enum:['easy','medium','hard']},
    tags:{type:String,enum:['array','Linkedlist','graph','dp'],required:true},
    visibleTestCases:[{input:{type:String,required:true},output:{type:String,required:true},explaination:{type:String,required:true}}],
    HiddenTestCases:[{input:{type:String,required:true},output:{type:String,required:true}}],
    startCode: [{
        language:{type:String,required:true},
        initialCode:{type:String,required:true}
    }],
    referenceSolution:[
        { language:{type:String,required:true},
        CompleteCode:{type:String,required:true}}
    ],
    problemCreater:{type:Schema.Types.ObjectId,ref:'user',required:true}
})

const Problem = mongoose.model('problem',problemSchema);
module.exports = Problem;