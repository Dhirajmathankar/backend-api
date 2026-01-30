


// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// module.exports.sendMail = async ({ to, subject, message }) => {
//   return transporter.sendMail({
//     from: `"Mittra Sheet" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text: message
//   });
// };


const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendMail = async ({ to, subject, message }) => {
  console.log('📤 Sending email to:', to);

  const response = await resend.emails.send({
    from: 'Mittra Sheet <onboarding@resend.dev>', // ✅ FIXED
    to,
    subject,
    html: `<p>${message}</p>`
  });

  console.log('✅ Resend response:', response);
  return response;
};

