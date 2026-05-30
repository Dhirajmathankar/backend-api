const DailySummary = require('../models/DailySummary');

exports.getDailySummaries = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // पिछले 30 दिनों का डेटा सीधे प्री-एग्रीगेटेड कलेक्शन से उठाएं (नो लूपिंग लोड)
    const summaries = await DailySummary.find({ userId })
      .sort({ dateString: -1 })
      .limit(30)
      .lean();

    res.status(200).json({ status: "success", data: summaries });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};