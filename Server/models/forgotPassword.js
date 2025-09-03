const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

const forgotPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // 10 minutes
    }
});

forgotPasswordSchema.post("save", async function(doc) {
    // send email with reset link:
    await sendEmail(
            doc.email,
            "Your Reset Password Link for Snakk App",
            `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Snakk Password Reset</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #FF5722; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <!-- Logo -->
                        <h1 style="color: white; margin-top: 10px;">Snakk App</h1>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #FF5722; text-align: center;">Password Reset</h2>
                        <p style="color: #666; text-align: center;">We received a request to reset your password. Click the button below to create a new password:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${doc.link}" style="background-color: #FF5722; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </div>
                        
                        <p style="color: #666; text-align: center; margin-bottom: 20px;">This link is valid for 10 minutes.</p>
                        <p style="color: #666; text-align: center; font-size: 13px;">If you didn't request a password reset, you can safely ignore this email.</p>
                        
                        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
                            If the button above doesn't work, copy and paste this link into your browser:<br>
                            <span style="color: #FF5722; word-break: break-all;">${doc.link}</span>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} Snakk App. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            `
        );
});

module.exports = mongoose.model("ForgotPassword", forgotPasswordSchema);