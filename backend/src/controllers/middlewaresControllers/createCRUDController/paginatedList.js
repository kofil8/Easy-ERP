const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const ownership = require('./ownership');
const { limitToCreatedBy } = ownership;

const paginatedList = async (Model, req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.max(parseInt(req.query.items, 10) || 10, 1);
  const skip = page * limit - limit;
  const sortBy = req.query.sortBy || 'enabled';
  const sortValue = req.query.sortValue ? parseInt(req.query.sortValue, 10) : -1;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
  const fields = fieldsArray.length === 0 ? {} : { $or: [] };
  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(escapeRegExp(req.query.q), 'i') } });
  }

  let filterCondition = {};
  if (req.query.filter && req.query.equal !== undefined && typeof req.query.equal !== 'object') {
    filterCondition = { [req.query.filter]: req.query.equal };
  } else if (req.query.filter && typeof req.query.equal === 'object') {
    return res.status(400).json({
      success: false,
      result: [],
      message: 'Invalid filter value',
    });
  }

  const baseQuery = limitToCreatedBy(Model, req, { ...filterCondition, ...fields });
  const resultsPromise = Model.find(baseQuery)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate()
    .exec();

  const countPromise = Model.countDocuments(baseQuery).exec();

  const [result, count] = await Promise.all([resultsPromise, countPromise]);

  return res.status(200).json({
    success: true,
    result,
    pagination: { page, pages: Math.ceil(count / limit) || 0, count },
    message: 'Successfully found all documents',
  });
};

module.exports = paginatedList;
