const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Define the whitelist for CORS
var whitelist = [
    'http://localhost:3000',
    'https://aifxtrader.com',
    'https://admin.aifxtrader.com',
    'http://api.aifxtrader.com',
    'http://localhost:3001',
]

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
};


app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '25kb' }));

// Configure CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware for serving static files
app.use(express.static('public'));

// routes
const apiKeyMiddleware = require('./middleware/apiKey.middleware');
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const subscribeRoutes = require("./routes/subscribe.route")

// Apply API key middleware to /api routes
app.use('/api', apiKeyMiddleware);


app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/user', userRoutes)
// app.use('/verify-email', )
app.use('/subscribe', subscribeRoutes)

module.exports = { app };
