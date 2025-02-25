const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('event')
        .sort('-createdAt');
    res.json(bookings);
}));

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity) {
        res.status(400);
        throw new Error('Please provide event ID and quantity');
    }

    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    const booking = await Booking.create({
        user: req.user._id,
        event: eventId,
        quantity,
        totalPrice: event.price * quantity,
        status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id).populate('event');
    res.status(201).json(populatedBooking);
}));

// @desc    Get all bookings
// @route   GET /api/bookings/admin
// @access  Private/Admin
router.get('/admin', protect, admin, asyncHandler(async (req, res) => {
    const bookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('event')
        .sort('-createdAt');
    res.json(bookings);
}));

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    booking.status = req.body.status || booking.status;
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
}));

module.exports = router;