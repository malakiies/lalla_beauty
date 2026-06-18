import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
export const getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
    
  res.json(notifications);
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
export const markNotificationAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    // Ensure the notification belongs to the user
    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this notification');
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
export const markAllNotificationsAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ message: 'All notifications marked as read' });
};
