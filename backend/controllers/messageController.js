import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';

// @desc    Send a new message
// @route   POST /api/messages
// @access  Public
export const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const newMessage = await Message.create({
    name,
    email,
    subject,
    message
  });

  if (newMessage) {
    res.status(201).json({
      message: 'Message sent successfully'
    });
  } else {
    res.status(400);
    throw new Error('Invalid message data');
  }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
export const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (message) {
    message.isRead = true;
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } else {
    res.status(404);
    throw new Error('Message not found');
  }
});
