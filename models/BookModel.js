const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookTittle: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 100,
        unique:true
    },
    bookAuther: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    bookGenre: {
        type: String,
        enum: [
            "fiction",
            "non-fiction",
            "mystery",
            "thriller",
            "romance",
            "fantasy",
            "science-fiction",
            "horror",
            "adventure",
            "historical-fiction",
            "biography",
            "autobiography",
            "memoir",
            "self-help",
            "philosophy",
            "psychology",
            "business",
            "health",
            "cooking",
            "travel",
            "art",
            "music",
            "sports",
            "religion",
            "spirituality",
            "politics",
            "history",
            "science",
            "technology",
            "education",
            "children",
            "young-adult",
            "poetry",
            "drama",
            "comedy",
            "humor",
            "crime",
            "detective",
            "western",
            "literary-fiction",
            "contemporary-fiction",
            "classic",
            "reference",
            "others"
        ],
        required: true,
        default: "fiction"
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
bookSchema.index({ bookTittle: 1, bookAuther: 1 }, { unique: true });

bookSchema.method.toListObject = function () {
    return {
        id: this._id,
        bookTittle: this.bookTittle
    }
}

bookSchema.methods.toSafeObject = function () {
    return {
        id: this._id.toString(),
        bookTittle: this.bookTittle,
        bookAuther: this.bookAuther,
        bookGenre: this.bookGenre,
        price: this.price,
        inStock: this.inStock
    }
}

const Book = mongoose.model("Book", bookSchema)

module.exports = Book;