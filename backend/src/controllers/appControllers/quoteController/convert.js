const mongoose = require('mongoose');

const Quote = mongoose.model('Quote');
const Invoice = mongoose.model('Invoice');

const { increaseBySettingKey, loadSettings } = require('@/middlewares/settings');

const convert = async (req, res) => {
  const quote = await Quote.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (!quote) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Quote not found',
    });
  }

  if (quote.converted?.invoice) {
    const existingInvoice = await Invoice.findOne({
      _id: quote.converted.invoice,
      removed: false,
    }).exec();

    if (existingInvoice) {
      return res.status(200).json({
        success: true,
        result: existingInvoice,
        message: 'Quote already converted to invoice',
      });
    }
  }

  const settings = await loadSettings();
  const nextInvoiceNumber = Number(settings.last_invoice_number || 0) + 1;

  const invoice = await new Invoice({
    createdBy: req.admin._id,
    number: nextInvoiceNumber,
    year: new Date().getFullYear(),
    date: new Date(),
    expiredDate: quote.expiredDate,
    client: quote.client?._id || quote.client,
    converted: {
      from: 'quote',
      quote: quote._id,
    },
    items: quote.items.map(({ itemName, description, quantity, price, total }) => ({
      itemName,
      description,
      quantity,
      price,
      total,
    })),
    taxRate: quote.taxRate,
    subTotal: quote.subTotal,
    taxTotal: quote.taxTotal,
    total: quote.total,
    currency: quote.currency,
    discount: quote.discount || 0,
    paymentStatus: quote.total === 0 ? 'paid' : 'unpaid',
    notes: quote.notes,
    status: 'draft',
  }).save();

  const fileId = 'invoice-' + invoice._id + '.pdf';
  const updateResult = await Invoice.findOneAndUpdate(
    { _id: invoice._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();

  await Quote.findOneAndUpdate(
    { _id: quote._id },
    {
      status: 'accepted',
      converted: {
        invoice: invoice._id,
        date: new Date(),
      },
    },
    {
      new: true,
    }
  ).exec();

  increaseBySettingKey({
    settingKey: 'last_invoice_number',
  });

  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Quote converted to invoice successfully',
  });
};

module.exports = convert;
