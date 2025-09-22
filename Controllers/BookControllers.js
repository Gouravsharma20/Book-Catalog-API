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


        const userId = req.user._id;
        const bookData = {
            ...req.body,
            createdBy: userId
        }




        const newBook = new Book(bookData)
        const book = await newBook.save()
        if (!book) return res.status(404).json({ error: "Book not found" })
        res.status(201).json({
            success: true,
            message: "book created successfully",
            book: book
        })
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
        const userId = req.user._id;
        const existingBook = await Book.findById(id);

        if (!existingBook) {
            return res.status(404).json({ error: "Book not found" });
        }
        if (existingBook.createdBy && existingBook.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                error: "Forbidden you can only edit book you created"
            })
        }
        const updateData = {...req.body};
        delete updateData.createdBy;

        const updated = await Book.findByIdAndUpdate(id,updateData,{
            new:true,
            runValidators:true,
        });
        return res.status(200).json({
            success:true,
            message:"Book updated successfully",
            book:updated
        })
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }

}


//DELETE A BOOK

const deleteSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) return res.status(400).json({ error: "Invalid book id" });

        const userId = req.user._id;

        const existingBook = await Book.findById(id);
        if(!existingBook){
            return res.status(404).json({error:"book not found"})
        }


        if (existingBook.createdBy && existingBook.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                error: "Forbidden you can only delete book you created"
            })
        }

        const removed = await Book.findByIdAndDelete(id);

        


        return res.status(200).json({
            success:true,
            message: "Book deleted successfully!",
            book: removed 
        })

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