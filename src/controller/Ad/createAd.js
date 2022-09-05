const AdModel = require('../../models/AdModel')
const aws_s3 = require('../../util/aws-sdk')
const validator = require('../../util/validator');
const userModel = require('../../models/userModel');


const createAd = async function (req, res) {

    try {

        let files = req.files;
        let productDetails = req.body;
        let userId = req.params.userId
        let userIdFromToken = req.userId

        if (!validator.isValidRequestBody(productDetails)) {
            return res.status(400).send({ status: false, message: "Please provide valid product details" })
        }

        let { title, description, price, category} = productDetails

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userid is required" })
        }
        let findUser=await userModel.findById(userId)
        
        if(!findUser) {
            return res.status(400).send({ status: false, message: "user not found" })
        }

        if (findUser._id.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }

        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: "Description is required" })
        }

        if (!validator.isValid(price)) {
            return res.status(400).send({ status: false, message: "Price is required" })
        }

        if (isNaN(Number(price))) {
            return res.status(400).send({ status: false, message: "Price Is a Valid Number" })
        }

        if (files!==undefined) {
            // return res.status(400).send({ status: false, message: "Please provide Book image" })
            let BookPhoto = await aws_s3.uploadFile(files[0])
            productDetails.BookImage = BookPhoto
        }


        if (!validator.isValidString(category)) {
            return res.status(400).send({ status: false, message: "category is required" })
        }

        if (category) {
            let categories= category.split(",")
                productDetails['category'] = categories
        }
        productDetails.userId=userId
        const saveProductDetails = await AdModel.create(productDetails)

        return res.status(201).send({ status: true, message: "Product added successfully.", data: saveProductDetails })


    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports=createAd