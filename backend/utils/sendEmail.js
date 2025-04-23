
const nodemailer = require('nodemailer');

// This is a mock implementation for demo purposes
// In production, you would use a real email service
const sendEmail = async ({ to, subject, text, html }) => {
  // For development, log instead of sending
  console.log('--------- EMAIL WOULD BE SENT ---------');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  if (html) console.log(`HTML: ${html}`);
  console.log('--------------------------------------');
  
  // In production, use something like:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  };
  
  await transporter.sendMail(mailOptions);
  */
  
  return true;
};

module.exports = sendEmail;
