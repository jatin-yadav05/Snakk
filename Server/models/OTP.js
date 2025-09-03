const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "5m" // This will automatically delete the document after 5 minutes
    }
});

otpSchema.post("save", async function(doc) {
    try {
        // send OTP to user's email
        await sendEmail(
            doc.email,
            "Your OTP Code for Snakk App",
            `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Snakk OTP Verification</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #FF5722; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <!-- Logo -->
                        <h1 style="color: white; margin-top: 10px;">Snakk App</h1>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #FF5722; text-align: center;">Your OTP Verification Code</h2>
                        <div style="font-size: 32px; font-weight: bold; text-align: center; margin: 30px 0; padding: 15px; background-color: #f8f8f8; border-radius: 4px; letter-spacing: 5px; color: #FF5722;">
                            ${doc.otp}
                        </div>
                        <p style="color: #666; text-align: center;">This code is valid for 5 minutes.</p>
                        <p style="color: #666; text-align: center; margin-top: 30px; font-size: 13px;">
                            If you didn't request this code, you can safely ignore this email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} Snakk App. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            `
        );
    }
    catch(error) {
        console.log(error);
    }
});

module.exports = mongoose.model("OTP", otpSchema);