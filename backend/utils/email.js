const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendResetEmail = async (toEmail, resetToken, baseUrl) => {
  const resetLink = `${baseUrl}/reset-password.html?token=${resetToken}&email=${encodeURIComponent(toEmail)}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'TaskKeeper - Password Reset',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #1a2332; border-radius: 8px; color: #fff;">
        <h1 style="color: #0896ee; text-align: center; margin-bottom: 20px;">TaskKeeper</h1>
        <h2 style="text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #ccc; line-height: 1.6;">You requested a password reset. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #0896ee; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #999; font-size: 13px;">This link expires in 1 hour.</p>
        <p style="color: #999; font-size: 13px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
