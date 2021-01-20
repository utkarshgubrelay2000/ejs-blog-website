const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
var validate = require("validate.js");
const adminModel=require('../model/adminModel')
const blog=require('../model/blogModel')


/////////------ User SignUp ----////////////////

exports.Signup = (req, res) => {
  const { name, email, password, mobile} = req.body;
 // const mobileNumber = req.body.mobileNumber ? req.body.mobileNumber : null;
  /**  name:string, 
    mobileNumber:number,
    password:string,
   */
  // validation
  let validation = validate(req.body, {
    name: {
      presence: true,
      format: {
        pattern: "^([a-zA-z]*\\s*)*[a-zA-z]$",
        message:
          "Enter full name and it can only contain alphabets and space in between",
      },
    },
    email: {
      presence: true,
      email: true,
    },
    password: {
      presence: true,
      length: { minimum: 6, message: "password must be 8 characters long" },
    },
  });
  if (validation) {
    res.status(400).json({ error: validation });
    return console.log(validation);
  } else {
    adminModel.findOne({ email: email }).then((user) => {
      if (user) {
        res.status(404).json({ error: "email Address is already taken" });
      } else {
        bcryptjs.hash(password, 12).then((hashedpassword) => {
          let newStudent = new adminModel({
            email: email,
            password: hashedpassword,
            name: name,
            mobile: mobile,
          });
        //  console.log('done');
          newStudent
            .save()
            .then((user) => {
             // console.log(user);
              const token = jwt.sign(
                { secretId: user.uId },
                process.env.JWT_SECRET
              );
              res.json({
                message: "signUp successfully",
              });
            })
            .catch((err) => {
              //   console.log(err.message)
              res.status(404).json({ error: err.message });
            });
        });
      }
    });
  }
};
/////////------ User SignIn ----////////////////
exports.Signin = (req, res) => {
  const { email, password } = req.body;
  let validation = validate(req.body, {
    email: {
      presence: true,
      email: true,
    },
    password: {
      presence: true,
    },
  });

  if (validation) {
    res.status(400).json({ error: validation });
    return console.log(validation);
  } else {
    adminModel.findOne({ email: email }).then((user) => {
      if (user) {
        // console.log(password,user.password)
        bcryptjs
          .compare(password, user.password)
          .then((ifSame) => {
            //if user is normal user
            if (ifSame) {
              let md5 = require("md5");
              let userId = md5(user._id);
              const token = jwt.sign(
                { secretId: userId },
                process.env.JWT_SECRET
              );
              blog.find({}).then(blogs=>{
                adminModel.find({}).then(userDetails=>{
                   // console.log(userDetails)
                  //  res.json({
                  //    token:token,userId:userDetails[0]._id,
                  //    name:userDetails[0].name
                  //  })
                    res.render('signUp',{blogs:blogs,userDetails:userDetails[0],token:token})
                })
            }).catch(err=>{
              console.log(err)
                res.send('4040 not found')
            })
            
  
            } else {
              res.status(400).json({ error: "Invalid password" });
            }
          })
          .catch((err) => {
            console.log("error in comparing password", err);
          });
      } else {
        res
          .status(404).json("you Are Not Admin")
      }
    });
  }
};
exports.logout=(req,res)=>{
 
  res.redirect('/')
}