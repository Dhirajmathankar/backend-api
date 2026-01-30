const ChatUser = require('../models/chatUser.model');
const ChatMessage = require('../models/chatMessage.model');
const emailService = require('../services/email.service');

exports.handleChatMessage = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
console.log(req.body);
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    let user = await ChatUser.findOne({ email });

    // 🆕 New user
    if (!user) {
      user = await ChatUser.create({ name, email, mobile });

      await emailService.sendMail({
        to: email,
        subject: 'Welcome to Mittra Sheet 🎉',
        message: `Hi ${name}, welcome! We’re happy to have you.`
      });

      user.isWelcomeMailSent = true;
      await user.save();
    }

    // 💾 Save message
    await ChatMessage.create({
      userId: user._id,
      message
    });

    // 🔔 Admin notification
    await emailService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: '📩 New Chat Message',
      message: `
        Name: ${user.name}<br/>
        Email: ${user.email}<br/>
        Mobile: ${user.mobile}<br/>
        Message: ${message}
      `
    });

    res.status(200).json({
      success: true,
      botReply: 'Thanks for your message 😊 We will contact you shortly.'
    });

  } catch (err) {
    console.error('CHAT ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
