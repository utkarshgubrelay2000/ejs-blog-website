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
const blog=require('../model/blogModel');
const admin = require('../model/adminModel');
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

router.post('/uploadImage',upload.single('avatar'),async (req,res)=>{
  console.log(req.file,req.body.id)
  await cloudinary.uploader.upload(req.file.path, function(error, result) {
blog.findById(req.body.id).then(found=>{
  found.thumbImage=result.secure_url
  found.save().then(saved=>{
    console.log('done');
    
    blog.find({}).then(blogs=>{
      admin.find().then(userDetails=>{
         // console.log(userDetails)
          res.render('adminPanel',{blogs:blogs,userDetails:userDetails[0]})
      })
  });
}).catch(err=>{
  res.send(err)
})
});
})
await unlinkAsync(req.file.path)
})

/* GET home page. */
router.get('/postBlog',(req,res)=>{
  res.render('author')
})

router.get('/adminPanel/:token',blogController.adminpanel)
router.get('/api/admin/secret',verifyAdmin,blogController.adminpanel)
router.post('/postBlog',blogController.postBlog,err=>{
  console.log('error while signup user')
})
router.get('/EditBlogById/:id/:token',verifyAdmin,blogController.editBlogPage)
router.put('/editBlog/:id/:token',verifyAdmin,blogController.editBlog,err=>{
  console.log('error while signup user')
})
router.delete('/deleteBlog/:id/:token',blogController.deleteBlog,err=>{
    console.log('error while signup user')
  })
  router.get('/',blogController.getAllBlog)
  router.get('/:id',blogController.getBlogById)
module.exports=router