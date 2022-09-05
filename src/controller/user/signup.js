const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')
const userModel=require('../../models/userModel')
const aws_s3 = require('../../util/aws-sdk')
const validator=require('../../util/validator')

const createUser = async function (req, res) {
    try {

        let files = req.files;
        let userDetails = req.body

        if (!validator.isValidRequestBody(userDetails)) {
            return res.status(400).send({ status: false, message: "please provide valid user Details" })
        }

        if (!validator.isValid(userDetails.name)) {
            return res.status(400).send({ status: false, message: "user name is required" })
        }

        if (!validator.isValid(userDetails.phone)) {
            return res.status(400).send({ status: false, message: "phone number is required" })
        }

        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/).test(userDetails.phone))
            return res.status(400).send({ status: false, message: "Phone number must be a valid Indian number." })

        const checkPhoneFromDb = await userModel.findOne({ phone: userDetails.phone })

        if (checkPhoneFromDb) {
            return res.status(400).send({ status: false, message: `${userDetails.phone} is already in use, Please try a new phone number.` })
        }

        if (!validator.isValid(userDetails.email)) {
            return res.status(400).send({ status: false, message: "Email-ID is required" })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userDetails.email))
            return res.status(400).send({ status: false, message: "Invalid Email id." })

        const checkEmailFromDb = await userModel.findOne({ email: userDetails.email })

        if (checkEmailFromDb) {
            return res.status(400).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
        }

        if (files!==undefined) {
            // return res.status(400).send({ status: false, message: "Profile Image is required" })
            let userImage = await aws_s3.uploadFile(files[0]);
            userDetails.profileImage = userImage
        }

        if (!validator.isValid(userDetails.password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

      

        const hashedPassword = await bcrypt.hash(userDetails.password, 10)

        userDetails.password = hashedPassword

        const saveUserInDb = await userModel.create(userDetails);
       
        return res.status(201).send({ status: true, message: "user created successfully!!", data: saveUserInDb });

    } catch (err) {

        return res.status(500).send({ status: false, error: err.message })

    }

}

module.exports=createUser