const nodemailer = require("nodemailer");


const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        auth: {
            user: process.env.GMAIL_USER, // Your Gmail address
            pass: process.env.GMAIL_PASS     // Your Gmail app password
        }
    });
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;