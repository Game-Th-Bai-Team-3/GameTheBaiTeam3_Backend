const nodemailer = require('nodemailer');

// Cấu hình Gmail SMTP - có thể gửi email cho mọi người!
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thongntmse171742@fpt.edu.vn', // Email Gmail của bạn
      pass: 'yeby lxft vagw gcce'  // App Password Gmail
    }
  });
};

// Template email cho reset password
const createResetPasswordEmail = (username, resetToken, frontendUrl) => {
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  
  return {
    subject: '🔐 Đặt lại mật khẩu - Game Thẻ Bài Team 3',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 30px 20px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
              }
              .content {
                  background: #f9f9f9;
                  padding: 30px 20px;
                  border-radius: 0 0 10px 10px;
                  border: 1px solid #ddd;
              }
              .button {
                  display: inline-block;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 15px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                  font-weight: bold;
              }
              .warning {
                  background: #fff3cd;
                  border: 1px solid #ffeaa7;
                  padding: 15px;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .footer {
                  margin-top: 30px;
                  text-align: center;
                  color: #666;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>🎮 Game Thẻ Bài Team 3</h1>
              <p>Yêu cầu đặt lại mật khẩu</p>
          </div>
          
          <div class="content">
              <h2>Xin chào ${username}!</h2>
              
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              
              <div style="background: #f8f9fa; border: 2px solid #007bff; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
                  <h3 style="margin: 0 0 15px 0; color: #007bff;">🔑 MÃ ĐẶT LẠI MẬT KHẨU</h3>
                  <p style="margin: 0 0 15px 0; font-size: 16px; color: #495057;">Copy mã này để đặt lại mật khẩu:</p>
                  <div style="background: #fff; border: 2px dashed #007bff; padding: 20px; margin: 15px 0; border-radius: 5px;">
                      <span style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #007bff; word-break: break-all;">
                          ${resetToken}
                      </span>
                  </div>
                  <p style="margin: 15px 0 0 0; font-size: 14px; color: #6c757d;">
                      📋 Click để select all → Ctrl+C để copy
                  </p>
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; font-weight: bold; color: #856404;">⏰ Hướng dẫn sử dụng:</p>
                  <ol style="margin: 10px 0; color: #856404;">
                      <li>Copy mã token ở trên</li>
                      <li>Paste vào API hoặc ứng dụng</li>
                      <li>Nhập mật khẩu mới</li>
                      <li>Xác nhận đổi mật khẩu</li>
                  </ol>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">
                      ⚠️ Token có hiệu lực <strong>10 phút</strong> và chỉ dùng được <strong>1 lần</strong>
                  </p>
              </div>
              
              <p>Trân trọng,<br>
              <strong>Team Game Thẻ Bài Team 3</strong></p>
          </div>
          
          <div class="footer">
              <p>© 2024 Game Thẻ Bài Team 3. All rights reserved.</p>
              <p>Email này được gửi tự động, vui lòng không reply.</p>
          </div>
      </body>
      </html>
    `,
    text: `
      Xin chào ${username}!
      
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
      
      🔑 MÃ ĐẶT LẠI MẬT KHẨU:
      ${resetToken}
      
      📋 Hướng dẫn:
      1. Copy mã token ở trên
      2. Paste vào API hoặc ứng dụng  
      3. Nhập mật khẩu mới
      4. Xác nhận đổi mật khẩu
      
      ⚠️ Token có hiệu lực 10 phút và chỉ dùng được 1 lần
      
      Lưu ý:
      - Link có hiệu lực trong 10 phút
      - Chỉ sử dụng được 1 lần duy nhất
      - Nếu không phải bạn yêu cầu, hãy bỏ qua email này
      
      Trân trọng,
      Team Game Thẻ Bài Team 3
    `
  };
};

// Gửi email reset password
exports.sendResetPasswordEmail = async (email, username, resetToken) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const emailTemplate = createResetPasswordEmail(username, resetToken, frontendUrl);
    
    const transporter = createGmailTransporter();
    
    const mailOptions = {
      from: '"🎮 Game Thẻ Bài Team 3" <thongntmse171742@fpt.edu.vn>',
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully via Gmail:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email đã được gửi thành công qua Gmail - có thể gửi cho mọi email!'
    };
    
  } catch (error) {
    console.error('❌ Gmail sending error:', error);
    throw new Error(`Không thể gửi email qua Gmail: ${error.message || 'Unknown error'}`);
  }
};

 