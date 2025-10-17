const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    githubUrl: {
        type: String,
        default: ''
    },
    technologies: [{
        type: String,
        trim: true
    }],
    featured: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'design', 'other'],
        default: 'web'
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
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
