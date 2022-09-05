const AdModel = require('../../models/AdModel')
const validator = require('../../util/validator')

const deleteAd = async function (req, res) {
    try {

        const AdId = req.params.AdId
        let userIdFromToken = req.userId

        if (!validator.isValidObjectId(AdId)) {
            return res.status(400).send({ status: false, message: `please enter a valid AdId` })
        }

        const Ad = await AdModel.findOne({ _id: AdId })

        if (!Ad) {
            return res.status(400).send({ status: false, message: `Ad Found` })
        }

        if (Ad.userId.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }
        if
         (Ad.isDeleted == false) {
            await AdModel.findOneAndUpdate({ _id: AdId }, { $set: { isDeleted: true } })

            return res.status(200).send({ status: true, message: `Ad deleted successfully.` })
        }
        return res.status(400).send({ status: true, message: `Ad has been already deleted.` })



    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports=deleteAd