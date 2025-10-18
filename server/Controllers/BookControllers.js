const Book = require("../models/BookModel");
const mongoose = require("mongoose");

//checking if id is correct
const isValidId = (id) => mongoose.isValidObjectId(id);

// Get AllBook Data
const getAllBook = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 })
        const safeList = books.map(b => (typeof b.toListObjects === "function" ? b.toListObjects() : { id: b._id, title: b.title }));
        res.status(200).json({
            success: true,
            message: "List of all books",
            Book: safeList
        }
        )
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
}

// Get a single book by ID (using query parameter)
const getSingleBook = async (req, res) => {
    try {
        const { _id } = req.params;
        
        if (!_id) {
            return res.status(400).json({ error: "Book id is required"});
        }
        if (_id === null || _id === "") {
            return res.status(404).json({error:"Book id is null or empty"})
        }
        if (!isValidId(_id)) {
            return res.status(400).json({ error: "Invalid book id" });
        }
        
        const book = await Book.findById(_id);
        if (!book) return res.status(404).json({ error: "Book not found" });
          
        // Check if the method exists on the book instance
        if (typeof book.toSafeObjects === "function") {
            const safe = book.toSafeObjects();
            return res.status(200).json({
                success: true,
                message: `Book with bookid ${safe.id}:`,
                book: safe
            });
        } else {
            // Fallback if method doesn't exist
            const fallback = {
                id: book._id.toString(),
                title: book.title,
                auther:book.auther,
                genre:book.genre,
                price:book.price,
                inStock:book.inStock
            };
            return res.status(200).json({
                success: true,
                message: `Book with bookid ${fallback.id}:`,
                book: fallback
            });
        }
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
}

// create a new book
const createNewBook = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is required" });
        }

        const normalize = s => (s || "").trim().replace(/\s+/g, " ");
        const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const bookTittleRaw = normalize(req.body.title || "");
        const bookAutherRaw = normalize(req.body.auther || "");

        const userId = req.user && req.user._id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const titleRegex = new RegExp(`^${escapeRegex(bookTittleRaw)}$`, "i");
        const existing = await Book.findOne({
            createdBy: userId,
            title: titleRegex
        });
        if (existing) {
            return res.status(409).json({
                success: false,
                error: "You have already added this book"
            });
        }
        const bookData = {
            ...req.body,
            createdBy: userId,
            title: bookTittleRaw,
            auther: bookAutherRaw,
            createdBy: userId
        }

        const newBook = new Book(bookData)
        const book = await newBook.save()
        const safe = (typeof book.toSafeObjects === "function") ? book.toSafeObjects() : book;
        res.status(201).json({
            success: true,
            message: "book created successfully",
            book: book
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "This book already exists (duplicate detected)",
                details: err.keyValue || null
            });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "user is not validated",
                error: "Validation failed",
                details: err.message
            });
        }
        return res.status(500).json({ error: err.message });
    }
}

// UPDATE A SINGLE BOOK
const updateSingleBook = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!isValidId(_id)) return res.status(400).json({ success: false, message: "Book id is not valid", error: "Invalid book id" });
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Add data in body to update", error: "Request body is required for update" });
        }
        const userId = req.user._id;
        const existingBook = await Book.findById(_id);

        if (!existingBook) {
            return res.status(404).json({ success: false, message: "Book doesnt exists , please add book to edit it", error: "Book not found" });
        }
        if (existingBook.createdBy && existingBook.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false, message: "You are not allowed to edit book which are not created by you",
                error: "Forbidden you can only edit book you created"
            })
        }
        const updateData = { ...req.body };
        delete updateData.createdBy;
        const updated = await Book.findByIdAndUpdate(_id, updateData, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book: updated
        })
    } catch (err) {
        res.status(500).json({ success: false, Error: err.message })
    }
}

//DELETE A BOOK
const deleteSingleBook = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!isValidId(_id)) return res.status(400).json({ error: "Invalid book id" });

        const userId = req.user._id;

        const existingBook = await Book.findById(_id);
        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: "Book doesnt exists or already deleted",
                error: "book not found"
            })
        }

        if (existingBook.createdBy && existingBook.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cant delete someone else created book",
                error: "Forbidden you can only delete book you created"
            })
        }

        const removed = await Book.findByIdAndDelete(_id);

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully!",
            book: removed
        })
    } catch (err) {
        res.status(500).json({ success: false, Error: err.message })
    }
}

module.exports = {
    getAllBook,
    getSingleBook,
    deleteSingleBook,
    updateSingleBook,
    createNewBook
}