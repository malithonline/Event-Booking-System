const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an event name']
    },
    venue: {
        type: String,
        required: [true, 'Please add a venue']
    },
    date: {
        type: Date,
        required: [true, 'Please add an event date']
    },
    price: {
        type: Number,
        required: [true, 'Please add a ticket price']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);