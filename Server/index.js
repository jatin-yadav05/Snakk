// Module imports
const express = require("express");
const { connectDB } = require("./config/Database");


// Environment variable configuration
require("dotenv").config();
// ENV VARS:
const PORT = process.env.PORT || 3001;

// Application instantiation:
const app = express();


// Database connection
connectDB();


// Routes:
// default route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Snakk API"
    });
});






// Server startup
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3001");
});