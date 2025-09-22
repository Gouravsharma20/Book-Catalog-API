const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookTittle:{
        type:String,
        trim:true,
        require:true,
        minlength:3,
        maxlength:100

    },
    bookAuther:{
        type:String,
        trim:true,
        require:true,
        minlength:3,
        maxlength:50
    },
    bookGenre:{
        type:String,
        Enum:["comedy","laughter","philosphy","self-help"],
        require:true,
    },
    price:{
        type:Number,
        require:true,
        min:0
    },
    inStock:{
        type:Boolean,
        require:true
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        require:false
    }
},{timestamps:true}
)

module.exports = mongoose.model("Book",bookSchema);