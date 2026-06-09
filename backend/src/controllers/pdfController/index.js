const pug = require('pug');
const fs = require('fs');
const path = require('path');
const { loadSettings } = require('@/middlewares/settings');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment'];

let browserInstance = null;
const getBrowser = async () => {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    throw new Error('PDF generation requires puppeteer. Run npm install in the backend folder.');
  }

  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserInstance;
};

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    const dir = path.dirname(targetLocation);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!pugFiles.includes(modelName.toLowerCase())) {
      throw new Error('Unsupported PDF model');
    }

    const settings = await loadSettings();
    const selectedLang = settings['easy_app_language'];
    const translate = useLanguage({ selectedLang });

    const {
      currency_symbol,
      currency_position,
      decimal_sep,
      thousand_sep,
      cent_precision,
      zero_format,
    } = settings;

    const { moneyFormatter } = useMoney({
      settings: {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      },
    });
    const { dateFormat } = useDate({ settings });

    settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

    const htmlContent = pug.renderFile(path.join('src', 'pdf', `${modelName}.pug`), {
      model: result,
      settings,
      translate,
      dateFormat,
      moneyFormatter,
      moment: require('moment'),
    });

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: targetLocation,
      format: info.format || 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
    });
    await page.close();

    if (callback) callback();
  } catch (error) {
    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }
    throw new Error(error);
  }
};
