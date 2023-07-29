const express = require("express");
const User = require("../models/User")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUser = require("../middleware/getUser")
const jwt_SECRETE = "IteMeHedes";

router.get("/", (req, res) => {
  res.send("auth");
});

router.post("/createuser", 
  [body('name', "invalid name").isLength({min : 1}),
  body('email', "invalid mail").isEmail(),
  body('password', "invalid password").isLength({ min: 5 }),],
  async (req, res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{

      let success = false;

      let user = await User.findOne({email : req.body.email})
      
      if(user){
        return res.status(400).json({ success, error : "email already exits"})
      }

      console.log("hid");

      const salt = await bycrypt.genSalt(10);
      const hash_paswd = await bycrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: hash_paswd,
        email : req.body.email
      })

      const data = {
        user : {
          id : user.id
        }
      }

      const authtoken =  jwt.sign(data, jwt_SECRETE);
      
      success = true;
         // res.json(user);
         res.json({success, authtoken});
      
    }catch(error){
      console.error(error.message);
      res.status(500).send("something went wrong");
    }
    console.log(req.body);
});


router.post("/login",[
  body('email', "invalid mail").isEmail(),
  body('password', "invalid password").exists()],
  async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({errors : errors.array()});
    }

    try {
       
      let success = false;

      const {email, password} = req.body;

      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({success, error: "Please try to login with correct credentials"}); 
      }

      const password_compared = await bycrypt.compare(password, user.password);
      if(!password_compared){
        return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }

      const data = {
        user : {
          id : user.id
        }
      }
      const authtoken = await jwt.sign(data, jwt_SECRETE);
      success = true;
      res.json({success, authtoken, user});  // response is send as json ( with success flag, token, user datail)
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("something went wrong");
    }

});



router.post("/getuser", getUser, async (req, res) => {
  try {

     userId = req.user.id;
    //  console.log(userId);
    //  console.log(typeof(userId))
    const user = await User.findOne({_id : userId}).select("-password");
    res.send(user);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("something went wrong");
  }
});


module.exports = router;