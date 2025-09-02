const User = require("../models/user");
const bcrypt = require("bcryptjs");

const signup = async(req, res) => {
    try {

        // fields destructuring:
        const { name, email, password } = req.body;

        // validating fields:
        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // regex checking:
        const emailRegex = /^[^\s@]+@(gmail\.com|chitkara\.edu\.in)$/; // format: example@gmail.com OR student@chitkara.edu.in
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format. Only gmail.com and chitkara.edu.in domains are allowed." });
        }

        // checking if user already exists:
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // 6 digit OTP generation:
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // hash password
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // user creation
        const newUser = await User.create(
            {
                name,
                email,
                password: hashedPassword,
                OTP: otp
            }
        );

        newUser.password = undefined; // removing password from response
        newUser.OTP = undefined; // removing OTP from response

        res.status(201).json({
            message: "User created successfully.",
            user: newUser
        });
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Error while creating user."
        });
    }
};

const login = async(req, res) => {
    try {
        console.log("login attempt");
        res.status(200).json({
            message: "Login successful."
        });
    }
    catch (error) {
        console.log(error);
    }
};


module.exports = { signup, login };