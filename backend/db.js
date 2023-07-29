const mongoose = require("mongoose");

const connectMongo = ()=> {
  mongoose.connect("mongodb://localhost:27017/StoryStorm", () =>{
    console.log("connected to mongo");
  });
};

module.exports = connectMongo;

// When we want to export a single class/variable/function
//from one module to another module, we use module.exports way.
