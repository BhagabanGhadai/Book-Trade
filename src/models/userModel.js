const mongoose=require('mongoose')

const userModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profileImage:{
        type:String
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    reviews:{
        type:Number,
        default:0
    },
    requests:{
        type:Number,
        default:0
    }

},{timestamps:true})

module.exports=mongoose.model('user',userModel)