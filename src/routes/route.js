const express=require('express')
const router=express.Router()

const authentication=require('../middleware/auth')
const signup=require('../controller/user/signup')
const login=require('../controller/user/login')
const edit=require('../controller/user/editUser')
const showRequest=require('../controller/user/showBuyingRequest')
const buyRequest=require('../controller/buyingRequest')
  
router.post('/signup',signup)
router.post('/login',login)
router.put('/user/:userId',authentication.userAuthentication,edit)
router.get('/message/:userId',authentication.userAuthentication,showRequest)
router.post('/buy/:userId/:AdId',authentication.userAuthentication,buyRequest)

const createAd=require('../controller/Ad/createAd')
const getOwnAd=require('../controller/Ad/getOwnAd')
const getallAd=require('../controller/Ad/getallAd')
const editAd=require('../controller/Ad/editAd')
const deleteAd=require('../controller/Ad/deleteAd')

router.post('/Ad/:userId',authentication.userAuthentication,createAd)
router.get('/Ad/:AdId',authentication.userAuthentication,getOwnAd)
router.get('/Ad',getallAd)
router.put('/Ad/:AdId',authentication.userAuthentication,editAd)
router.delete('/Ad/:AdId',authentication.userAuthentication,deleteAd)

router.get('/',function(req,res){
    res.send('working')
})

module.exports=router