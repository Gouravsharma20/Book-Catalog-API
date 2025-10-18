const express = require("express")

const Book = require("../models/BookModel");
const { getAllBook,getSingleBook,deleteSingleBook,updateSingleBook,createNewBook } = require("../Controllers/BookControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//get all book
router.get("/",getAllBook)



//create a new book

router.post("/",authMiddleware,createNewBook)

//get a single book by its id
router.get("/:_id",getSingleBook)


// update a book

router.put("/:_id",authMiddleware,updateSingleBook)

//delete a book

router.delete("/:_id",authMiddleware,deleteSingleBook)


module.exports = router;
