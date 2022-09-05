const bcrypt = require('bcrypt')
const userModel=require('../../models/userModel')
const aws_s3 = require('../../util/aws-sdk')
const validator=require('../../util/validator')

const updateUser = async function (req, res) {

    try {

        let files = req.files
        let userDetails = req.body
        let userId = req.params.userId
        let userIdFromToken = req.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid UserId" })
        }

        const findUserData = await userModel.findById(userId)

        if (!findUserData) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        if (findUserData._id.toString() != userIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }

        let { name, email, phone, password} = userDetails

        
        if (!validator.isValidRequestBody(userDetails)) {
            return res.status(400).send({ status: false, message: "Please provide user's details to update." })
        }

        if (!validator.isValidString(name)) {
            return res.status(400).send({ status: false, message: 'name is Required' })
        }

        if (!validator.isValidString(email)) {
            return res.status(400).send({ status: false, message: 'email is Required' })
        }
        if (email) {

            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userDetails.email))
                return res.status(400).send({ status: false, message: "Invalid Email id." })

            const checkEmailFromDb = await userModel.findOne({ email: userDetails.email })

            if (checkEmailFromDb)
                return res.status(404).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
        }


        if (!validator.isValidString(phone)) {
            return res.status(400).send({ status: false, message: 'phone number is Required' })
        }

        if (phone) {
            if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/).test(userDetails.phone))
                return res.status(400).send({ status: false, message: "Phone number must be a valid Indian number." })

            const checkPhoneFromDb = await userModel.findOne({ phone: userDetails.phone })

            if (checkPhoneFromDb) {
                return res.status(400).send({ status: false, message: `${userDetails.phone} is already in use, Please try a new phone number.` })
            }
        }


        if (!validator.isValidString(password)) {
            return res.status(400).send({ status: false, message: 'password is Required' })
        }

        if (password) {
            var hashedPassword = await bcrypt.hash(password, 10)
            
        }  
        
        let updatedData={
            name:name,
            email:email,
            phone:phone,
            password:hashedPassword,
        }
        if (files!==undefined) {
            var userImage = await aws_s3.uploadFile(files[0])
           updatedData.profileImage=userImage
         }

        let updateProfileDetails = await userModel.findOneAndUpdate(
            { _id: userId },
              updatedData,
            { new: true })

        return res.status(200).send({ status: true, msg: "User Update Successful!!", data: updateProfileDetails })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports=updateUser