const { mongoose } = require("mongoose")

const connectDB = async() => {
    await mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });
};

module.exports = {connectDB};
