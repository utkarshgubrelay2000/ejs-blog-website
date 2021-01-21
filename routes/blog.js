var express = require('express');
var router = express.Router();
var blogController=require('../controller/blogController');
const verifyAdmin = require('../middleware/verifyAdmin');
var mutter=require('multer')
var path=require('path')
const fs = require('fs')
const { promisify } = require('util')
var cloudinary = require('cloudinary').v2;
const unlinkAsync = promisify(fs.unlink)

cloudinary.config({ 
  cloud_name: 'dvu7miswu', 
  api_key: '539199276215388', 
  api_secret: 'DprEYY0gs9Vg2G9osNPxYcLHAvA' 
});

var Storage = mutter.diskStorage({
  destination: "./Static",
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
  })
  var upload = mutter({
    storage: Storage
  })
  
  router.get('/ji',(req,res)=>{
    res.json('hhh')
  })
    router.get('/getAllBlog',blogController.getAllBlogInResponse)/// json response
    router.get('/getBlogById/:id',blogController.getBlogByIdInResponse)/// json response

/* GET home page. */
router.get('/postBlog',(req,res)=>{
  res.render('author')
})

router.post('/postBlog',blogController.postBlog,err=>{
  console.log('error while signup user')
})
router.put('/editBlog/:id',blogController.editBlog,err=>{
  console.log('error while signup user')
})
router.delete('/deleteBlog/:id',blogController.deleteBlog,err=>{
    console.log('error while signup user')
  })
  router.get('/',blogController.getAllBlog) //// for ejs render
  router.get('/getBlog/:id',blogController.getBlogById) // ejs render

//// Json Response
module.exports=router