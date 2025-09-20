const Book = require("../models/BookModel");
const mongoose = require("mongoose");

//checking if id is correct
const isValidId = (id) => mongoose.isValidObjectId(id);

// Get AllBook Data

const getAllBook = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 })
        res.status(200).json(books)

    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
}

// get A SINGLE BOOK

const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) return res.status(400).json({ error: "Invalid book id" });
        const book = await Book.findById(id)
        if (!book) return res.status(404).json({ error: "Book not found" })
        res.status(200).json(book)

    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

}

// create a new book

const createNewBook = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is required" });
        }
        const newBook = new Book(req.body)
        const book = newBook.save()
        if (!book) return res.status(404).json({ error: "Book not found" })
        res.status(201).json(book)

    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

}

// UPDATE A SINGLE BOOK

const updateSingleBook = async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) return res.status(400).json({ error: "Invalid book id" });
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is required for update" });
        }
        const updated = await Book.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true,
        })
        if (!updated) return res.status(404).json({ error: "Book not found" });
        return res.status(200).json(updated)
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

}


//DELETE A BOOK

const deleteSingleBook = async (req, res) => {
    try {
        const {id} = req.params;
        if (!isValidId(id)) return res.status(400).json({ error: "Invalid book id" });
        const removed = await Book.findByIdAndDelete(id)
        if(!removed) return res.status(404).json({error: "Book not found"})
        return res.status(200).json({message:"Book deleted successfully!",book:removed})

    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

}




module.exports = {
    getAllBook,
    getSingleBook,
    deleteSingleBook,
    updateSingleBook,
    createNewBook
}