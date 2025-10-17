const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ['frontend', 'backend', 'database', 'devops', 'design', 'other'],
        default: 'other'
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 5
    },
    icon: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#3b82f6' // Default blue color
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
skillSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
