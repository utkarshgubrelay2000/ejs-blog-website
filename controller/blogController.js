const admin = require('../model/adminModel');
const blog = require('../model/blogModel');

exports.postBlog = async (req, res) => {
    const { content, thumbImage, heading, shortContent, userId } = req.body
    console.log(req.body.thumbImage)
    // res.render('author',{content:content})
    let newdate = new Date()
    let blogId = heading.replace(/\s/g, "-")
    // //console.log(newdate.toDateString())
    let newBog = new blog({
        heading: heading, content: content, thumbImage: thumbImage, blogId: blogId,
        date: newdate.toDateString(), time: newdate.toLocaleTimeString(),
        shortContent: shortContent, userId: userId
    })
    newBog.save().then(saved => {
        console.log(shortContent)
        res.json('success')
        //  res.redirect('/api/admin/secret')
    }).catch(err => {
        res.send('404 not found')
    })
}
exports.adminpanel = (req, res) => {

    blog.find({}).then(blogs => {
        admin.findOne({ _id: blogs[0].userId }).then(userDetails => {
            // console.log(userDetails)
            res.render('adminPanel', { blogs: blogs, userDetails: userDetails })

        })
    }).catch(err => {
        res.send('4040 not found')
    })
}
exports.editBlog = (req, res) => {
    const { content, thumbImage, heading } = req.body
    let blogId = heading.replace(/\s/g, "-")
    blog.findByIdAndUpdate(req.params.id, {
        heading: heading, content: content, thumbImage: thumbImage
        , blogId: blogId
    }).then(saved => {
        res.json('Updated')
    }).catch(err => {
        res.status(404).json('4040 not found')
    })
}
exports.deleteBlog = (req, res) => {
    console.log('done', req.params)
    blog.findOneAndDelete({ blogId: req.params.id }).then(success => {
        res.json('success')
    }).catch(err => {
        res.status(404).json('4040 not found')
    })
}
exports.getAllBlog = (req, res) => {
    blog.find({}).then(blogs => {
        //  console.log(blogs)
        admin.find({}).then(userDetails => {
           
            res.render('index', { blogs: blogs, userDetails: userDetails[0] })
        })
    }).catch(err => {
        res.send('4040 not found')
    })
}
exports.getBlogById = (req, res) => {

    blog.findOne({ blogId: req.params.id }).sort({ _id: -1 }).then(blogs => {
        admin.find().then(userDetails => {
            //  console.log(userDetails)
            blog.find({}).sort({ _id: -1 }).then(blogsRec => {
                res.render('post', { blog: blogs, userDetails: userDetails[0], moreBlogs: blogsRec })
            })
        })
    }).catch(err => {
        res.send('404 not found')
    })
}
exports.getAllBlogInResponse = (req, res) => {
    blog.find({}).sort({ _id: -1 }).then(blogs => {
        admin.find({}).then(userDetails => {
            res.json({ blogs: blogs, userDetails: userDetails[0] })
        })
    }).catch(err => {
        res.status(404).json('404 not found')
    })
}
exports.getBlogByIdInResponse = (req, res) => {

    blog.findOne({ blogId: req.params.id }).sort({ _id: -1 }).then(blogs => {
        console.log(blogs.userId)
        admin.find().then(userDetails => {
            //  console.log(userDetails)
            blog.find({}).sort({ _id: -1 }).then(blogsRec => {
                res.json({ blog: blogs, userDetails: userDetails[0], moreBlogs: blogsRec })
            })
        })
    }).catch(err => {
        res.status(404).json('404 not found')
    })
}