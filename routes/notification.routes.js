const express = require('express');
const router = express.Router();
const NotificationLog = require('../models/NotificationLog');

// @route   PATCH /api/notifications/tag/:id
// @desc    Update transaction tag type (clean / will-get / will-give)
router.patch('/tag/:id', async (req, res) => {
  try {
    const { status } = req.body; // status can be: 'clean', 'will-get', 'will-give'
    
    if (!['clean', 'will-get', 'will-give'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status tag" });
    }

    const updatedLog = await NotificationLog.findByIdAndUpdate(
      req.params.id,
      { isTagged: status },
      { new: true }
    );

    if (!updatedLog) {
      return res.status(404).json({ success: false, message: "Log record not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Transaction tagged successfully as ${status}`,
      data: updatedLog
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;