const express=require('express')
const app=express()

const multer=require('multer')
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 app.use(multer().any())
 
 const mongoose=require('mongoose')
 mongoose.connect('mongodb+srv://ABHI:1rgLK1SKF60O1lEF@cluster0.skx8q.mongodb.net/booktrade',{ useNewUrlParser: true })
 .then(() => console.log('MongoDB is connected!!'))
 .catch(err => console.log(err))
 
 
const route=require('./routes/route')
app.use('/',route)

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});