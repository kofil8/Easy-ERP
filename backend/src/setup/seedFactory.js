const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const { generate: uniqueId } = require('shortid');
const mongoose = require('mongoose');

const getModel = (modelName, modelPath) => {
  try {
    return mongoose.model(modelName);
  } catch (error) {
    return require(modelPath);
  }
};

const createSettingData = ({ email, language, timezone, country, config = {} }) => {
  const settingData = [];
  const settingsPattern = path.join(__dirname, 'defaultSettings', '**', '*.json').replace(/\\/g, '/');
  const settingsFiles = globSync(settingsPattern);
  const settingsToUpdate = {
    easy_app_email: email,
    easy_app_company_email: email,
    easy_app_timezone: timezone,
    easy_app_country: country,
    easy_app_language: language,
    company_email: email,
    company_country: country,
    last_invoice_number: 1,
    last_quote_number: 1,
    last_payment_number: 1,
    ...config,
  };

  for (const filePath of settingsFiles) {
    const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    settingData.push(
      ...file.map((setting) => {
        if (Object.prototype.hasOwnProperty.call(settingsToUpdate, setting.settingKey)) {
          return { ...setting, settingValue: settingsToUpdate[setting.settingKey] };
        }

        return { ...setting };
      })
    );
  }

  return settingData;
};

const buildLineItems = (items, taxRate = 0) => {
  const calculatedItems = items.map((item) => ({ ...item, total: item.quantity * item.price }));
  const subTotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = subTotal * (taxRate / 100);

  return {
    items: calculatedItems,
    subTotal,
    taxTotal,
    total: subTotal + taxTotal,
  };
};

const seedAdmin = async ({ name, surname, email, password }) => {
  const Admin = getModel('Admin', '../models/coreModels/Admin');
  const AdminPassword = getModel('AdminPassword', '../models/coreModels/AdminPassword');
  const newAdminPassword = new AdminPassword();
  const salt = uniqueId();

  const admin = await new Admin({
    email,
    name,
    surname,
    enabled: true,
    role: 'owner',
    photo: 'public/uploads/admin/idurar-icon-png-80-i1kez.png',
  }).save();

  await new AdminPassword({
    password: newAdminPassword.generateHash(salt, password),
    emailVerified: true,
    authType: 'email',
    loggedSessions: [],
    salt,
    user: admin._id,
  }).save();

  return admin;
};

const seedSettings = async (setupOptions) => {
  const Setting = getModel('Setting', '../models/coreModels/Setting');
  const settings = createSettingData(setupOptions);

  await Setting.insertMany(settings);

  return settings;
};

const seedReferenceData = async () => {
  const PaymentMode = getModel('PaymentMode', '../models/appModels/PaymentMode');
  const Taxes = getModel('Taxes', '../models/appModels/Taxes');

  const taxes = await Taxes.insertMany([
    { taxName: 'Tax 0%', taxValue: 0, isDefault: true, enabled: true },
    { taxName: 'Sales Tax 10%', taxValue: 10, isDefault: false, enabled: true },
  ]);

  const paymentModes = await PaymentMode.insertMany([
    {
      name: 'Cash',
      description: 'Cash payment received at the office or point of sale.',
      isDefault: true,
      enabled: true,
    },
    {
      name: 'Bank Transfer',
      description: 'Direct transfer to the company bank account.',
      isDefault: false,
      enabled: true,
    },
  ]);

  return { taxes, paymentModes };
};

const seedBusinessData = async ({ admin, paymentMode, currency }) => {
  const Client = getModel('Client', '../models/appModels/Client');
  const Invoice = getModel('Invoice', '../models/appModels/Invoice');
  const Quote = getModel('Quote', '../models/appModels/Quote');
  const Payment = getModel('Payment', '../models/appModels/Payment');
  const Upload = getModel('Upload ', '../models/coreModels/Upload');
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const clients = await Client.insertMany([
    {
      name: 'Acme Corporation',
      phone: '+1 555 0148',
      country: 'United States',
      address: '100 Market Street, San Francisco, CA',
      email: 'billing@acme.example',
      createdBy: admin._id,
      assigned: admin._id,
      enabled: true,
    },
    {
      name: 'Globex Trading',
      phone: '+1 555 0199',
      country: 'United States',
      address: '40 Commerce Avenue, Austin, TX',
      email: 'accounts@globex.example',
      createdBy: admin._id,
      assigned: admin._id,
      enabled: true,
    },
  ]);

  const invoiceTotals = buildLineItems(
    [
      {
        itemName: 'ERP implementation package',
        description: 'Initial setup, configuration, and data migration.',
        quantity: 1,
        price: 1200,
      },
      {
        itemName: 'User onboarding session',
        description: 'Live training for finance and sales users.',
        quantity: 2,
        price: 150,
      },
    ],
    10
  );

  const invoice = await new Invoice({
    createdBy: admin._id,
    number: 1,
    year: today.getFullYear(),
    content: 'Implementation services for the first ERP rollout phase.',
    recurring: 'monthly',
    date: today,
    expiredDate: nextMonth,
    client: clients[0]._id,
    items: invoiceTotals.items,
    taxRate: 10,
    subTotal: invoiceTotals.subTotal,
    taxTotal: invoiceTotals.taxTotal,
    total: invoiceTotals.total,
    currency,
    credit: 500,
    discount: 0,
    paymentStatus: 'partially',
    isOverdue: false,
    approved: true,
    notes: 'Seed invoice with a partial payment for demo reporting.',
    status: 'sent',
    pdf: 'invoice-seed-1.pdf',
    files: [
      {
        id: 'invoice-seed-file-1',
        name: 'Implementation scope.pdf',
        path: 'public/uploads/invoice/implementation-scope.pdf',
        description: 'Seeded invoice attachment.',
        isPublic: true,
      },
    ],
  }).save();

  const payment = await new Payment({
    createdBy: admin._id,
    number: 1,
    client: clients[0]._id,
    invoice: invoice._id,
    date: today,
    amount: 500,
    paymentMode: paymentMode._id,
    currency,
    ref: 'SEED-PAY-001',
    description: 'Initial deposit for ERP implementation.',
  }).save();

  invoice.payment = [payment._id];
  await invoice.save();

  const quoteTotals = buildLineItems(
    [
      {
        itemName: 'CRM customization',
        description: 'Pipeline stages, custom fields, and dashboard setup.',
        quantity: 1,
        price: 850,
      },
      {
        itemName: 'Monthly support retainer',
        description: 'Priority support and minor configuration changes.',
        quantity: 3,
        price: 120,
      },
    ],
    10
  );

  const quote = await new Quote({
    createdBy: admin._id,
    number: 1,
    year: today.getFullYear(),
    content: 'CRM customization and support proposal.',
    date: today,
    expiredDate: nextMonth,
    client: clients[1]._id,
    items: quoteTotals.items,
    taxRate: 10,
    subTotal: quoteTotals.subTotal,
    taxTotal: quoteTotals.taxTotal,
    total: quoteTotals.total,
    currency,
    discount: 0,
    notes: 'Seed quote ready for customer review.',
    status: 'sent',
    pdf: 'quote-seed-1.pdf',
    files: [
      {
        id: 'quote-seed-file-1',
        name: 'CRM proposal.pdf',
        path: 'public/uploads/quote/crm-proposal.pdf',
        description: 'Seeded quote attachment.',
        isPublic: true,
      },
    ],
  }).save();

  const upload = await new Upload({
    modelName: 'Admin',
    fieldId: admin._id.toString(),
    fileName: 'idurar-icon-png-80-i1kez.png',
    fileType: 'png',
    isPublic: true,
    userID: admin._id,
    isSecure: false,
    path: 'public/uploads/admin/idurar-icon-png-80-i1kez.png',
  }).save();

  return { clients, invoice, payment, quote, upload };
};

const seedDatabase = async (options = {}) => {
  const setupOptions = {
    name: options.name || 'Admin',
    surname: options.surname || 'Owner',
    email: options.email || 'admin@admin.com',
    password: options.password || 'admin123',
    language: options.language || 'en_us',
    timezone: options.timezone || 'UTC',
    country: options.country || 'United States',
    currency: options.currency || 'USD',
    config: options.config || {},
  };

  const admin = await seedAdmin(setupOptions);
  await seedSettings(setupOptions);
  const { taxes, paymentModes } = await seedReferenceData();
  const businessData = await seedBusinessData({
    admin,
    paymentMode: paymentModes[0],
    currency: setupOptions.currency,
  });

  return {
    admin,
    settings: true,
    taxes,
    paymentModes,
    ...businessData,
  };
};

module.exports = {
  seedDatabase,
  createSettingData,
  buildLineItems,
};
