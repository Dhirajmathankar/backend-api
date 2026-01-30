const emailService = require('../services/email.service');
const EmailLog = require('../models/mittraSheetEmailLog.model');

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'to, subject and message are required'
      });
    }

    // 1️⃣ Send Email
    await emailService.sendMail({
      to,
      subject,
      message
    });

    // 2️⃣ Save entry in DB
    const emailLog = new EmailLog({
      to,
      subject,
      message,
      status: 'SENT',
      createdBy: req.user?._id // optional
    });

    await emailLog.save();

    res.status(200).json({
      success: true,
      message: 'Email sent & logged successfully',
      data: emailLog
    });

  } catch (error) {
    console.error('Email error:', error);

    // ❌ Failure case me bhi DB entry
    await EmailLog.create({
      to: req.body?.to,
      subject: req.body?.subject,
      message: req.body?.message,
      status: 'FAILED',
      errorMessage: error.message
    });

    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
};
