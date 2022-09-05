const AdModel = require('../models/AdModel')
const validator = require('../util/validator');
const userModel = require('../models/userModel');
const buyingRequestModel = require('../models/buyingRequestModel');

const wantToBuy=async function(req,res){
    try{
        let AdId=req.params.AdId
        let userId=req.params.userId
        let data=req.body
        let userIdFromToken = req.userId
        
        
        if (!validator.isValidObjectId(AdId)) {
            return res.status(400).send({ status: false, message: "AdId is required" })
        }
        let findAd=await AdModel.findById(AdId)
        
        if(!findAd) {
            return res.status(400).send({ status: false, message: "Ad not found" })
        }
 
        
        if(findAd.userId.toString() == userId) {
            return res.status(403).send({ status: false, message: "You can't Buy your own product" })
        }
        
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userid is required" })
        }
        let findUser=await userModel.findById(userId)
        
        if(!findUser) {
            return res.status(400).send({ status: false, message: "user not found" })
        }

        if(findUser._id.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }
        if (!validator.isValid(data.offerPrice)) {
            return res.status(400).send({ status: false, message: "offerPrice is required" })
        }
            data.AdId=AdId
            data.userId=userId
            
        const Buy=await buyingRequestModel.create(data)

        if(Buy){
          const updateUserData=await userModel.findOneAndUpdate({ _id: AdId.userId },{$inc:{ requests: 1 }})
        }
        return res.status(201).send({ status: true, message: "Buying request Sent Successful" ,data:data })
    }
    catch(err){
        res.status(500).send({ status: false, Error: err.message })
    }
}

module.exports=wantToBuy