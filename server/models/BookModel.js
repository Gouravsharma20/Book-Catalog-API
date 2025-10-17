const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 100,
        unique:true
    },
    auther: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    genre: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

}, { timestamps: true }
)
bookSchema.index({ title: 1, auther: 1 }, { unique: true });

bookSchema.methods.toListObject = function () {
    return {
        id: this._id,
        title: this.title
    }
}

bookSchema.methods.toSafeObject = function () {
    return {
        id: this._id.toString(),
        title: this.title,
        auther: this.auther,
        genre: this.genre,
        price: this.price,
        inStock: this.inStock
    }
}

const Book = mongoose.model("Book", bookSchema)

module.exports = Book;