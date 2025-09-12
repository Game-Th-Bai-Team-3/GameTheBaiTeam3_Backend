const transporter = require('../config/mail');
const fs = require('fs');
const path = require('path');

async function sendOtp(email, otp) {
    try {
        //doc file html 
        const templatePath = path.join(__dirname, '../templates/otp.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        //thay the {{OTP}} trong file html bang otp
        html = html.replace('{{OTP}}', otp);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            html: html
        });
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email');
    }
}
module.exports = sendOtp;