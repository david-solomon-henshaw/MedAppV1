const nodemailer = require('nodemailer');

// Set up your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'davidsolomon230@gmail.com',         // your email
    pass: 'eoak gseu bykm umhl'  // app-specific password or email password
  }
});

module.exports = transporter;
 