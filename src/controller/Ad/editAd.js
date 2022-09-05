const AdModel = require('../../models/AdModel')
const aws_s3 = require('../../util/aws-sdk')
const validator = require('../../util/validator')

const updateAd = async function (req, res) {

    try {
        const updatedData = req.body
        const AdId = req.params.AdId
        let files = req.files;
        let userIdFromToken = req.userId

        if (!validator.isValidObjectId(AdId)) {
            return res.status(400).send({ status: false, message: "Invalid AdId" })
        }

        const checkAd = await AdModel.findOne({ _id: AdId, isDeleted: false })

        if (!checkAd) {
            return res.status(404).send({ status: false, message: "Ad not found" })
        }

        if (checkAd.userId.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }

        if (!validator.isValidRequestBody(updatedData)) {
            return res.status(400).send({ status: false, message: "please provide product details to update" })
        }

        const { title, description, price, category, userId } = updatedData

        const updatedProductDetails = {}

        if (!validator.isValidString(title)) {
            return res.status(400).send({ status: false, message: `Title is required` })
        }
        if (!validator.isValidString(userId)) {
            return res.status(400).send({ status: false, message: `userId is required` })
        }
        if (userId) {
            if (!validator.isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "userid is required" })
            }
            let findUser = await userModel.findById(userId)

            if (!findUser) {
                return res.status(400).send({ status: false, message: "user not found" })
            }
        }

        if (!validator.isValidString(description)) {
            return res.status(400).send({ status: false, message: `Description is required` })
        }

        if (description) {
            updatedProductDetails['description'] = description
        }

        if (!validator.isValidString(price)) {
            return res.status(400).send({ status: false, message: `price is required` })
        }
        if (price) {

            if (isNaN(Number(price))) {
                return res.status(400).send({ status: false, message: `Price should be a valid number` })
            }
            if (price <= 0) {
                return res.status(400).send({ status: false, message: `Price should be a valid number` })
            }

            updatedProductDetails['price'] = price
        }


        if (files && files.length) {
            let updatedproductImage = await aws_s3.uploadFile(files[0]);
            updatedProductDetails.productImage = updatedproductImage

        }


        if (!validator.isValidString(category)) {
            return res.status(400).send({ status: false, message: `category is required` })
        }

        if (category) {
            let categories = category.split(",")
            updatedProductDetails.category=categories
        }

        const updatedAd = await AdModel.findOneAndUpdate(
            { _id: AdId },
            updatedProductDetails,
            { new: true })

        return res.status(200).send({ status: true, message: 'Product details updated successfully.', data: updatedAd });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports=updateAd



