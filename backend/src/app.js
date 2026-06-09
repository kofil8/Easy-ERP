const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import your custom winston logger utility
const logger = require('./utils/logger');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');

const app = express();

// 2. Stream HTTP request details into your Winston logger files
const morganStream = {
  write: (message) => logger.info(message.trim()),
};

// Use standard 'combined' or 'dev' format based on your environment
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: morganStream }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(fileUpload());

// Root api health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running smoothly.' });
});

// Basic rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    result: null,
    message: 'Too many authentication attempts, please try again later.',
  },
});

// Here our API Routes
coreAuthRouter.use('/login', authLimiter);
coreAuthRouter.use('/forgetpassword', authLimiter);
coreAuthRouter.use('/resetpassword', authLimiter);

app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// Fallback handling if routes do not match
app.use(errorHandlers.notFound);

// Locate this block at the bottom of your app.js file and update it:
app.use((err, req, res, next) => {
  // Instead of passing a raw string, pass an object with metadata.
  // The custom Winston filter will strip passwords out of req.body automatically.
  logger.error({
    message: `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`,
    meta: {
      ip: req.ip,
      body: req.body, // Scanned and redacted safely by Winston
      query: req.query,
    },
  });

  errorHandlers.productionErrors(err, req, res, next);
});

module.exports = app;
