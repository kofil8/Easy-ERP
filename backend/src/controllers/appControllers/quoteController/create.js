const mongoose = require('mongoose');

const Model = mongoose.model('Quote');

const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const schema = require('./schemaValidate');

const calculateQuoteTotals = (body) => {
  const { items = [], taxRate = 0 } = body;

  let subTotal = 0;

  items.forEach((item) => {
    const total = calculate.multiply(item.quantity, item.price);
    subTotal = calculate.add(subTotal, total);
    item.total = total;
  });

  const taxTotal = calculate.multiply(subTotal, Number(taxRate) / 100);
  const total = calculate.add(subTotal, taxTotal);

  return {
    ...body,
    items,
    subTotal,
    taxTotal,
    total,
  };
};

const create = async (req, res) => {
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

  const body = calculateQuoteTotals(value);
  body.createdBy = req.admin._id;

  const result = await new Model(body).save();
  const fileId = 'quote-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();

  increaseBySettingKey({
    settingKey: 'last_quote_number',
  });

  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Quote created successfully',
  });
};

module.exports = create;
module.exports.calculateQuoteTotals = calculateQuoteTotals;
