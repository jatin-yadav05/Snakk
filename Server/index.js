// Module imports
const express = require("express");
const { connectDB } = require("./config/Database");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

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
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: __dirname + '/tmp', // Store temp files in Server/tmp
})); // it will create a temp folder in root directory to store the images temporarily before uploading to cloudinary


// Database and Cloudinary connection
connectDB();
cloudinaryConnect();


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