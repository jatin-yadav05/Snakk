// Module imports
const express = require("express");
const { connectDB } = require("./config/Database");

// import routes:
const userRoutes = require("./routes/user.routes");



// Environment variable configuration
require("dotenv").config();
// ENV VARS:
const PORT = process.env.PORT || 3001;


// Application instantiation:
const app = express();


// Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database connection
connectDB();


// Routes:
// default route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Snakk API"
    });
});

// userRoutes:
app.use("/api/v1/users", userRoutes);




// Server startup
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:3001");
});