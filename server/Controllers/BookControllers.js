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
            books: safeList
        }
        )
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
}

// Get a single book by ID (using query parameter)
const getSingleBook = async (req, res) => {
    try {
        const idParams = req.params._id || req.params.id;
        
        if (!idParams) {
            return res.status(400).json({ error: "Book id is required"});
        }
        if (!isValidId(idParams)) {
            return res.status(400).json({ error: "Invalid book id" });
        }
        
        const book = await Book.findById(idParams);
        if (!book) return res.status(404).json({ error: "Book not found" });
          
        
        if (typeof book.toSafeObjects === "function") {
            const safe = book.toSafeObjects();
            return res.status(200).json({
                success: true,
                message: `Book with bookid ${safe.id}:`,
                book: safe
            });
        } else {
            const fallback = {
                id: book._id.toString(),
                title: book.title,
                author:book.author,
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

        const bookTitleRaw = normalize(req.body.title || "");
        const bookAuthorRaw = normalize(req.body.author || "");

        const userId = req.user && req.user._id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const titleRegex = new RegExp(`^${escapeRegex(bookTitleRaw)}$`, "i");
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
            title: bookTitleRaw,
            author: bookAuthorRaw,
            createdBy: userId
        }

        const newBook = new Book(bookData)
        const book = await newBook.save()
        const safe = (typeof book.toSafeObjects === "function") ? book.toSafeObjects() : book;
        res.status(201).json({
            success: true,
            message: "book created successfully",
            book: safe
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
        const idParams = req.params._id || req.params.id;
        if (!idParams||!isValidId(idParams)) {
            return res.status(400).json({
                success: false,
                message: "Book id is not valid",
                error: "Invalid book id" }
            );
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Add data in body to update",
                error: "Request body is required for update" }
            );
        }
        const userId = req.user && (req.user._id || req.user.id ||req.user.userId);
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized - user not found in token"});
        }
        const existingBook = await Book.findById(idParams);

        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: "Book doesnt exists , please add the book to edit it",
                error: "Book not found"
            });
        }
        if (existingBook.createdBy && existingBook.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false, message: "You are not allowed to edit book which are not created by you",
                error: "Forbidden you can only edit book you created"
            })
        }
        const updateData = { ...req.body };
        delete updateData.createdBy;
        const updated = await Book.findByIdAndUpdate(idParams, updateData, {
            new: true,
            runValidators: true,
        });
        const safe = (updated && typeof updated.toSafeObjects === "function")
        ? updated.toSafeObjects()
        : updated;
        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book: safe
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            Error: err.message 
        })
    }
}

//DELETE A BOOK
const deleteSingleBook = async (req, res) => {
    try {
        const idParams = req.params._id || req.params.id;
        // const { _id } = req.params;
        if (!idParams || !isValidId(idParams)){
            return res.status(400).json({ error: "Invalid book id" });

        } 

        const userId = req.user && (req.user.id || req.user._id || req.user.userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "invalid usedId or user doesnt exists",
                error: "Unauthorized - user not found in token"
            })
        }


        const existingBook = await Book.findById(idParams);
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

        const removed = await Book.findByIdAndDelete(idParams);
        const safe = (removed && typeof removed.toSafeObjects === "function")
        ? removed.toSafeObjects()
        : removed;

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully!",
            book: safe
        })
    } catch (err) {
        console.error("deleteSingleBook error:", err);
        return res.status(500).json({ success: false, Error: err.message })
    }
}

module.exports = {
    getAllBook,
    getSingleBook,
    deleteSingleBook,
    updateSingleBook,
    createNewBook
}