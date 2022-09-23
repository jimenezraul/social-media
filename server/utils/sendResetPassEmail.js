const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  // sent reset password email
  sendResetPassEmail: async (email, token) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Password',
      text: `Click on the link to reset your password: http://localhost:3000/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log('Error Occurs', err);
      } else {
        console.log('Email sent!!!');
      }
    });
  },
};
