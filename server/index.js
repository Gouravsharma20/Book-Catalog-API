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