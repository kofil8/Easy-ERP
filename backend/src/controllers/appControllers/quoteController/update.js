const mongoose = require('mongoose');

const Model = mongoose.model('Quote');

const schema = require('./schemaValidate');
const { calculateQuoteTotals } = require('./create');

const update = async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  if (!value.items.length) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  const previousQuote = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  if (!previousQuote) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Quote not found',
    });
  }

  const body = calculateQuoteTotals(value);
  body.pdf = 'quote-' + req.params.id + '.pdf';
  body.updated = Date.now();

  if (body.hasOwnProperty('currency')) {
    delete body.currency;
  }

  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
    new: true,
  }).exec();

  return res.status(200).json({
    success: true,
    result,
    message: 'Quote updated successfully',
  });
};

module.exports = update;
