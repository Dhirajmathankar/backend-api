const ChatUser = require('../models/chatUser.model');
const ChatMessage = require('../models/chatMessage.model');
const emailService = require('../services/email.service');

exports.handleChatMessage = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    let user = await ChatUser.findOne({ email });

    // 🆕 New User
    if (!user) {
      user = await ChatUser.create({
        name,
        email,
        mobile
      });

      // ✉️ Welcome Email (ONLY ONCE)
      await emailService.sendMail({
        to: email,
        subject: 'Welcome to Mittra Sheet 🎉',
        message: `Hi ${name}, welcome! We are happy to have you.`
      });

      user.isWelcomeMailSent = true;
      await user.save();
    }

    // 💾 Save message
    const chatMessage = await ChatMessage.create({
      userId: user._id,
      message
    });

    // 🔔 Admin Notification Email
    await emailService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Chat Message Received',
      message: `
        Name: ${user.name}
        Email: ${user.email}
        Mobile: ${user.mobile}
        Message: ${message}
      `
    });

    res.status(200).json({
      success: true,
      botReply: 'Thanks for your message 😊 We will contact you shortly.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
