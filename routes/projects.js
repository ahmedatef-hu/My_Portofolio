const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/projects';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
        }
    }
});

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Get projects error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        console.error('Get project error:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private/Admin
router.post(
    '/',
    [
        auth,
        upload.single('image'),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('demoUrl', 'Demo URL is required').isURL(),
            check('technologies', 'Technologies are required').isArray({ min: 1 })
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Remove uploaded file if validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, description, demoUrl, githubUrl, technologies, featured, category } = req.body;
            
            const projectFields = {
                title,
                description,
                demoUrl,
                technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(tech => tech.trim()),
                imageUrl: req.file ? `/uploads/projects/${req.file.filename}` : ''
            };

            if (githubUrl) projectFields.githubUrl = githubUrl;
            if (featured) projectFields.featured = featured === 'true' || featured === true;
            if (category) projectFields.category = category;

            const project = new Project(projectFields);
            await project.save();
            
            res.status(201).json(project);
        } catch (err) {
            console.error('Create project error:', err);
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private/Admin
router.put(
    '/:id',
    [
        auth,
        upload.single('image'),
        [
            check('title', 'Title is required').optional().not().isEmpty(),
            check('demoUrl', 'Demo URL must be valid').optional().isURL(),
            check('technologies', 'Technologies must be an array').optional().isArray()
        ]
    ],
    async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(404).json({ message: 'Project not found' });
            }

            const { title, description, demoUrl, githubUrl, technologies, featured, category } = req.body;
            
            if (title) project.title = title;
            if (description) project.description = description;
            if (demoUrl) project.demoUrl = demoUrl;
            if (githubUrl !== undefined) project.githubUrl = githubUrl;
            if (technologies) {
                project.technologies = Array.isArray(technologies) 
                    ? technologies 
                    : technologies.split(',').map(tech => tech.trim());
            }
            if (featured !== undefined) project.featured = featured === 'true' || featured === true;
            if (category) project.category = category;
            
            // Handle new image upload
            if (req.file) {
                // Delete old image if it exists
                if (project.imageUrl) {
                    const oldImagePath = path.join('public', project.imageUrl);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                project.imageUrl = `/uploads/projects/${req.file.filename}`;
            }

            await project.save();
            res.json(project);
        } catch (err) {
            console.error('Update project error:', err);
            if (req.file) fs.unlinkSync(req.file.path);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete associated image
        if (project.imageUrl) {
            const imagePath = path.join('public', project.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await project.remove();
        res.json({ message: 'Project removed' });
    } catch (err) {
        console.error('Delete project error:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/projects/reorder
// @desc    Reorder projects
// @access  Private/Admin
router.patch('/reorder', auth, async (req, res) => {
    try {
        const { projects } = req.body;
        
        if (!Array.isArray(projects)) {
            return res.status(400).json({ message: 'Projects array is required' });
        }

        const bulkOps = projects.map(({ _id, order }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: { order } }
            }
        }));

        await Project.bulkWrite(bulkOps);
        res.json({ message: 'Projects reordered successfully' });
    } catch (err) {
        console.error('Reorder projects error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
