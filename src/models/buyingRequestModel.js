const mongoose=require('mongoose')

const BuyingRequestModel=new mongoose.Schema({
   AdId:{
    type:mongoose.Types.ObjectId,
    ref:'Ad'
   },
    offerPrice:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    message:{
        type:String
    }

},{timestamps:true})

module.exports=mongoose.model('BuyingRequest',BuyingRequestModel)