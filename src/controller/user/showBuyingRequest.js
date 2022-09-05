const AdModel = require('../../models/AdModel')
const validator = require('../../util/validator');
const buyingRequestModel = require('../../models/buyingRequestModel');

const messages=async function(req,res){
    try{
        let userId=req.params.userId
        let userIdFromToken = req.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId is required" })
        }
        let findAd=await AdModel.findOne({userId:userId,isDeleted:false})
        
        if(!findAd) {
            return res.status(400).send({ status: false, message: "user have no Ad found" })
        }

        if(findAd.userId.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }
console.log(findAd._id)
        const messageList=await buyingRequestModel.find({AdId:findAd._id})

        return res.status(200).send({ status: true, message: "Message List",data:messageList })
    }
    catch(err){
        res.status(500).send({ status: false, Error: err.message })
    }
}

module.exports=messages