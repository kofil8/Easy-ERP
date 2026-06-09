const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const ownership = require('./ownership');
const { limitToCreatedBy } = ownership;

const search = async (Model, req, res) => {
  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];
  const query = req.query.q;
  const sanitizedQuery = escapeRegExp(query);

  if (!sanitizedQuery) {
    return res.status(200).json({
      success: true,
      result: [],
      message: 'No search query provided',
    });
  }

  const fields = { $or: [] };
  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(sanitizedQuery, 'i') } });
  }

  const result = await Model.find({
    ...fields,
    ...limitToCreatedBy(Model, req),
  })
    .limit(20)
    .exec();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully found documents',
  });
};

module.exports = search;
