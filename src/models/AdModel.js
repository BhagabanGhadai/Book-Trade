const mongoose=require('mongoose')

const AdModel=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:[String],
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

module.exports=mongoose.model('Ad',AdModel)