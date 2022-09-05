const AdModel = require('../../models/AdModel')
const validator = require('../../util/validator')

const getAdById = async function (req, res) {
    try {
        const AdId = req.params.AdId
        let userIdFromToken = req.userId


        if (!validator.isValidObjectId(AdId)) {
            return res.status(400).send({ status: false, message: `${AdId} is not a valid Ad id` })
        }


        const Ad = await AdModel.findOne({ _id: AdId, isDeleted: false });

        if (Ad.userId.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }
        if (!Ad) {
            return res.status(404).send({ status: false, message: `Ad does not exists` })
        }

        return res.status(200).send({ status: true, message: 'Ad found successfully', data: Ad })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}
module.exports=getAdById