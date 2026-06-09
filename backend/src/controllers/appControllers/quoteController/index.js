const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Quote');

const create = require('./create');
const update = require('./update');
const summary = require('./summary');
const sendMail = require('./sendMail');
const convert = require('./convert');

methods.create = create;
methods.update = update;
methods.summary = summary;
methods.mail = sendMail;
methods.convert = convert;

module.exports = methods;
