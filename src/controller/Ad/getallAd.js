const AdModel = require('../../models/AdModel')

const getAllAd=async function (req,res){
    
        try {
            
            const Ad = await AdModel.find({isDeleted:false}).sort({createdAt:-1});
    
            if (!Ad) {
                return res.status(404).send({ status: false, message: `Ad does not exists` })
            }
    
            return res.status(200).send({ status: true, message: 'Ad found successfully', data: Ad })
    
        } catch (err) {
            return res.status(500).send({ status: false, error: err.message });
        }
    
}

module.exports=getAllAd