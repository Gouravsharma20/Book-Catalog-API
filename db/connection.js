const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/backendModule")
.then(()=>{
    console.log("connection established from db successfully");
}).catch((err)=>{
    console.log(`Error is : ${err}`)
})