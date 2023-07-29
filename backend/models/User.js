const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const userSchema = new Schema({
  name : {
    type : String,
    require : true
  },
  email : {
    type : String,
    require : true,
    unique : true
  },
  password : {
    type : String,
    require : true
  },
  date : {
    type : Date,
    default : Date.now  // dont use Date.now()
  }
});

const User = mongoose.model("user", userSchema);

// User.createIndexes(function (err) {  //  we must have some data which is unique (here email)
//   if (err) console.log(err);
//  });

module.exports = User;