require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(morgan('dev'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_admin',
    collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
    console.error('Session store error:', error);
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);

// Serve admin panel
app.get('/admin*', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/admin/login.html');
    }
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// Serve login page
app.get('/admin/login', (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/admin/dashboard');
    }
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
