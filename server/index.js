require("dotenv").config();

const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5001

const app = express();

//db connection
require("./db/connection")

//require routes

const bookRoutes = require("./routes/BookRoutes")

const userRoutes = require("./routes/UserRoutes")

//base route

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Book API</title>
    </head>
    <body>
      <h1>Welcome to the Book API</h1>
      
      <p><strong>Note:</strong> Book API has 4 Book endpoints:</p>
      
      <ul>
        <li>Get All Books</li>
        <li>Get Book by ID (get a single book)</li>
        <li>Update a single book [Secured - only creator can update their book & cannot update its author]</li>
        <li>Delete a single book [Secured - only creator can delete their own book]</li>
      </ul>

      <p><strong>Note:</strong> User API has 3 User endpoints:</p>
      
      <ul>
        <li>User Registration[User SignUp]</li>
        <li>user login</li>
        <li>get all users[just for debugging and checking user]</li>
      </ul>
      
      <h3>Endpoints:</h3>
      <ul>
      <p><strong>Books Endpooint</:</p>


        <li>Books: /api/books</li>
        <li>Books: /api/books/id[Get single book(Unsecured) Create & update Book(Secured)]</li>

        <p><strong>User Endpooint</:</p>
        <li>Users: /api/users[Get All Users]</li>
        <li>Users: /api/users/register[User Registration]</li>
        <li>Users: /api/users/login[User Login]</li>
      </ul>
    </body>
    </html>
  `);
});




//Middlewares
app.use(express.json())
app.use(cors());


// Book Routes
app.use("/api/books",bookRoutes)

// User Routes
app.use("/api/users",userRoutes)

app.listen(PORT,()=>
    console.log(`app is running on port ${PORT}`)
);