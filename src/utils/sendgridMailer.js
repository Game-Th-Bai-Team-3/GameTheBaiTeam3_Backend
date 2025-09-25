// sendgridMailer.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOtpEmail(to, otp) {
  const msg = {
    to,
    from: process.env.EMAIL_USER, // email đã xác thực trong SendGrid
    subject: 'Mã OTP của bạn',
    text: `Mã OTP của bạn là: ${otp}`,
    html: `<p>Mã OTP của bạn là: <b>${otp}</b></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ OTP email sent!");
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.response?.body || error.message);
    throw error;
  }
}

module.exports = sendOtpEmail;
