const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function sendEmail({ user, subject, htmlContent }) {
    // Generate a verification token and set expiry
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 15 * 60 * 1000;

    // Update user with OTP and expiry
    user.otp = verificationToken;
    user.otpExpiry = tokenExpiry;
    await user.save();

    // Replace token placeholder in the HTML content
    const dynamicHtmlContent = htmlContent.replace('{{verificationURL}}', `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`);

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
            to: user.email,
            subject,
            html: dynamicHtmlContent
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        return { error: 'Failed to send email', success: false };
    }

    return { success: true };
}

module.exports = sendEmail;
