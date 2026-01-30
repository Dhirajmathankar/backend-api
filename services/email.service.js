// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER, // your email
//     pass: process.env.EMAIL_PASS  // app password
//   }
// });

// exports.sendMail = async ({ to, subject, message }) => {
//   const mailOptions = {
//     from: `"Venue App" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html: `
//       <h3>New Information</h3>
//       <p>${message}</p>
//     `
//   };
//    console.log('Sending email to:', transporter);
//   return transporter.sendMail(mailOptions);
// };


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports.sendMail = async ({ to, subject, message }) => {
  return transporter.sendMail({
    from: `"Mittra Sheet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message
  });
};
