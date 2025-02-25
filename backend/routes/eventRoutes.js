const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
}));

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
}));

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const { name, venue, date, price } = req.body;

    if (!name || !venue || !date || !price) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const event = await Event.create({
        name,
        venue,
        date,
        price,
        createdBy: req.user._id
    });

    res.status(201).json(event);
}));

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedEvent);
}));

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
}));

module.exports = router;