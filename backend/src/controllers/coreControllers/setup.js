require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const Joi = require('joi');
const { seedDatabase } = require('../../setup/seedFactory');

const setup = async (req, res) => {
  const { name, email, password, language, timezone, country, config = {} } = req.body;

  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().required(),
  });

  const { error } = objectSchema.validate({ name, email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  await seedDatabase({ name, email, password, language, timezone, country, config });

  return res.status(200).json({
    success: true,
    result: {},
    message: 'Successfully easy App Setup',
  });
};

module.exports = setup;
