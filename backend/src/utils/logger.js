const { createLogger, format, transports } = require('winston');
const path = require('path');

// 1. List the sensitive keys you want to scrub from all incoming logs
const SENSITIVE_KEYS = [
  'password',
  'passwordConfirm',
  'creditCard',
  'cardNumber',
  'token',
  'secret',
];

// 2. Define the custom formatting rule to mask data
const redactSensitiveFields = format((info) => {
  // Deep clone or recursive search function to look inside objects/arrays
  const maskObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    for (const key in obj) {
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        obj[key] = '********'; // Mask value
      } else if (typeof obj[key] === 'object') {
        maskObject(obj[key]); // Recurse into nested objects
      }
    }
    return obj;
  };

  // Process the main log message body and any meta arguments passed
  if (typeof info.message === 'object') {
    info.message = maskObject({ ...info.message });
  } else if (typeof info.message === 'string') {
    // Basic regex fallback if an object string representation slips through
    SENSITIVE_KEYS.forEach((key) => {
      const regex = new RegExp(`("${key}"\\s*:\\s*")[^"]+(")`, 'gi');
      info.message = info.message.replace(regex, `$1********$2`);
    });
  }

  // Scrub extra metadata arguments attached to the log
  if (info.meta) {
    info.meta = maskObject({ ...info.meta });
  }

  return info;
});

// Update the combined configuration format
const consoleFormat = format.combine(
  redactSensitiveFields(), // <-- Must be executed BEFORE final text formatting
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) => {
    const formattedMessage =
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    return `[${timestamp}] ${level}: ${stack || formattedMessage}`;
  })
);

const fileFormat = format.combine(
  redactSensitiveFields(), // <-- Mask files too
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    new transports.File({
      filename: path.join(__dirname, 'logs', 'combined.log'),
      format: fileFormat,
    }),
  ],
});

module.exports = logger;
