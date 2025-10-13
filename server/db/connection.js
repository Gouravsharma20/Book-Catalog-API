const mongoose = require("mongoose");

const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/backendModule";
console.log("Connecting to database...")

mongoose.connect(connectionString)
.then(()=>{
    console.log("connection established from db successfully");
}).catch((err)=>{
    console.log(`Error is : ${err}`)
})