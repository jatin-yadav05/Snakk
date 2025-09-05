const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const VerifiedEmail = require("../models/verifiedEmail");
const ForgotPassword = require("../models/forgotPassword");

const tokenGenerator = (user, res) => {
    const jwtToken = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRES_IN || '3d' }
    );

    // cookie-setting with JWT token:
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3days
        httpOnly: true,
    };
    res.cookie("token", jwtToken, options);
    return;
}

const signup = async (req, res) => {
    try {

        // fields destructuring:
        const { name, email, password } = req.body;

        // validating fields:
        if (!name || !email || !password) {
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

        // check if email is verified:
        const verifiedEmail = await VerifiedEmail.findOne({ email });
        if (!verifiedEmail) {
            return res.status(400).json({ message: "Email is not verified." });
        }

        // hash password
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // user creation
        const newUser = await User.create(
            {
                name,
                email,
                password: hashedPassword
            }
        );

        // delete from verified emails
        await VerifiedEmail.deleteOne({ email });

        newUser.password = undefined; // removing password from response

        // JWT token Generation and cookie setting:
        tokenGenerator(newUser, res);

        res.status(201).json({
            message: "User created successfully.",
            user: newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while creating user."
        });
    }
};

const login = async (req, res) => {
    try {
        // fields destructuring:
        const { email, password } = req.body;

        // validating fields:
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // checking if user exists:
        const user = await User.findOne({ email });

        // if not, return error:
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // password matching:
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        user.password = undefined; // removing password from response

        // JWT token Generation and cookie setting:
        tokenGenerator(user, res);

        res.status(200).json({
            message: "Login successful.",
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while logging in."
        });
    }
};

const auth = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access." });
        }

        res.status(200).json({
            message: "User is authenticated.",
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while checking authentication."
        });
    }
};


const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // check if user and verified email with that email already exists:
        const existingUser = await User.findOne({ email });
        const existingVerifiedEmail = await VerifiedEmail.findOne({ email });

        if (existingUser || existingVerifiedEmail) {
            return res.status(400).json({ message: "Email is already verified." });
        }

        // check if otp exists:
        const existingOTP = await OTP.findOne({ email });
        // 6 digit OTP generation:
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // if exists, update it, else create new:
        if (existingOTP) {
            // update otp:
            existingOTP.otp = otp;
            existingOTP.createdAt = Date.now();
            await existingOTP.save();
        }
        else {
            // create new OTP:
            await OTP.create({ email, otp });
        }

        res.status(200).json({
            message: "OTP sent successfully."
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while sending OTP."
        });
    }
}


const verifyOTP = async (req, res) => {
    try {
        // extract OTP:
        const { email, otp } = req.body;

        // if otp exists on that particular email:
        const existingOTP = await OTP.findOne({ email });

        // if not, return error:
        if (!existingOTP || existingOTP.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        // delete the otp document:
        await VerifiedEmail.create({ email });
        await OTP.deleteOne({ email });

        // OTP is valid:
        res.status(200).json({
            message: "OTP verified successfully."
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while verifying OTP."
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        // extract email:
        const { email } = req.body;

        // check if user with that email exists:
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // generate reset link:
        // resetLink = url + _id + 6 digit random number:
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const resetLink = `${process.env.CLIENT_URL}/reset-password?id=${user._id}&random=${randomNumber}`;

        // save reset link and user email in ForgotPassword collection:
        await ForgotPassword.create({ email, link: resetLink });

        res.status(200).json({
            message: "Password reset link sent successfully."
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while sending password reset link."
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { link, password, confirmPassword } = req.body;

        // validate:
        if (!link && !password && !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const forgotPasswordEntry = await ForgotPassword.findOne({ link });

        if (!forgotPasswordEntry) {
            return res.status(404).json({ message: "Invalid or expired link." });
        }

        // check if passwords match:
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // find user using email:
        const userToBeUpdated = await User.findOne({ email: forgotPasswordEntry.email });

        const isPasswordsMatching = await bcrypt.compare(password, userToBeUpdated.password);

        if (isPasswordsMatching) {
            return res.status(401).json({
                message: "Passwords must be unique"
            });
        }

        if (!userToBeUpdated) {
            return res.status(404).json({ message: "User not found." });
        }

        // generate salt and hash password:
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(userToBeUpdated._id, { password: hashedPassword });

        // delete forgot password entry:
        await ForgotPassword.deleteOne({ link });

        res.status(200).json({
            message: "Password reset successfully."
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while resetting password."
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;

        // validate all fields:
        if (!email && !oldPassword && !newPassword && !confirmPassword) {
            return res.status(401).json({
                message: "All fields are required!"
            });
        }

        if (oldPassword === newPassword) {
            return res.status(401).json({
                message: "Passwords must be unique"
            });
        }

        // passwords matching:
        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                message: "Passwords do not match"
            });
        }

        // extract the user:
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "No user found!"
            });
        }

        // Verify pass from user:
        const isCorrectPass = await bcrypt.compare(oldPassword, user.password);

        if (!isCorrectPass) {
            return res.status(401).json({
                message: "Password is incorrect!"
            });
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Change password from old to new & save

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while changing password."
        });
    }
}

module.exports = { signup, login, auth, sendOTP, verifyOTP, forgotPassword, resetPassword, changePassword };