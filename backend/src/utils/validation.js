const Joi = require('joi');

const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? item.trim() : sanitizeObject(item)
      );
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const commonValidationSchema = Joi.object({
  name: Joi.string().trim().max(255).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  notes: Joi.string().optional(),
  content: Joi.string().optional(),
});

module.exports = { sanitizeObject, sanitizeString, commonValidationSchema };
