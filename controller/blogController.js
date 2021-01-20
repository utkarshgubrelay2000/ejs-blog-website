const admin = require('../model/adminModel');
const blog=require('../model/blogModel');

exports.postBlog= async (req,res)=>{
    const {content,heading,shortContent,userId}=req.body
    console.log(req.body.thumbImage)
   // res.render('author',{content:content})
   
    let newdate= new Date()
let blogId=heading.replace(/\s/g,"-")
// //console.log(newdate.toDateString())
   let newBog=new blog({
       heading:heading,content:content, blogId: blogId,
       date:newdate.toDateString(),time:newdate.toLocaleTimeString(),
       shortContent:shortContent,userId:userId
   })
   newBog.save().then(saved=>{
       console.log(shortContent)
       res.json(saved._id)
    //  res.redirect('/api/admin/secret')
   }).catch(err=>{
      res.send('404 not found')
   })
}
exports.adminpanel=(req,res)=>{

    blog.find({}).then(blogs=>{
        admin.find({}).then(userDetails=>{
           // console.log(userDetails)
            res.render('adminPanel',{blogs:blogs,userDetails:userDetails[0]})

        })
    }).catch(err=>{
        res.send('4040 not found')
    })
}
exports.editBlog=(req,res)=>{
    const {content,heading}=req.body
    let blogId=heading.replace(/\s/g,"-")
   blog.findByIdAndUpdate(req.params.id,{ heading:heading,content:content,
     blogId: blogId}).then(saved=>{
        blog.find({}).then(blogs=>{
            admin.find({}).then(userDetails=>{
                console.log(userDetails)
                res.render('adminPanel',{blogs:blogs,userDetails:userDetails[0]})
    
            })
        }).catch(err=>{
            res.send('4040 not found')
        })
    }).catch(err=>{
       res.status(404).json('4040 not found')
    })
}
exports.deleteBlog=(req,res)=>{
console.log('done',req.params)
   blog.findOneAndDelete({blogId:req.params.id}).then(success=>{
      res.redirect('/signin')
    }).catch(err=>{
        res.status(404).json('4040 not found')
    })
}
exports.getAllBlog=(req,res)=>{
    blog.find({}).then(blogs=>{
        admin.find({}).then(userDetails=>{
           // console.log(userDetails)
            res.render('index',{blogs:blogs,userDetails:userDetails[0]})
        })
    }).catch(err=>{
        res.send('4040 not found')
    })
}
exports.getBlogById=(req,res)=>{
    blog.findOne({blogId:req.params.id}).sort({_id:-1}).then(blogs=>{
       // console.log(blogs.userId)
        admin.find({}).then(userDetails=>{
            console.log(userDetails)
            blog.find({}).sort({_id:-1}).then(blogsRec=>{
                res.render('post',{blog:blogs,userDetails:userDetails[0],moreBlogs:blogsRec})
            })
        })
    }).catch(err=>{
        res.send('4040 not found')
    })
}
exports.editBlogPage=(req,res)=>{
    blog.findOne({blogId:req.params.id}).sort({_id:-1}).then(blogs=>{
       // console.log(blogs.userId)
        admin.find({}).then(userDetails=>{
                res.render('edit',{blog:blogs,userDetails:userDetails[0]})
        })
    }).catch(err=>{
        res.send('4040 not found')
    })
}

exports.uploadImage=(req,res)=>{
 
res.json('Success')
}