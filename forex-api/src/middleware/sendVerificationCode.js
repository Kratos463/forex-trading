const nodemailer = require('nodemailer');

async function sendVerificationEmail(admin) {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
    const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP expiry time (15 minutes)

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
    
        const mailOptions = {
            from: `"Forex Trading" <${process.env.EMAIL_USER}>`,
            to: admin.email,
            subject: 'Email Verification',
            text: `Your verification code is ${otp}. It will expire in 15 minutes.`
        };
    
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        return res.status(401).json({error: 'Failed to send verification email', success: false});
    }
}

module.exports = sendVerificationEmail;
