const Notification = require('../models/Notification');

// @desc Get current user's notifications
// @route GET /api/notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      recipientId: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark a single notification or all as read
// @route PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    if (req.params.id === 'all') {
      await Notification.updateMany({ recipientId: req.user.id, isRead: false }, { isRead: true });
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
