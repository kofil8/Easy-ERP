const ownership = require('./ownership');
const { limitToCreatedBy } = ownership;

const listAll = async (Model, req, res) => {
  try {
    const sort = req.query.sort || 'desc';
    const enabled = req.query.enabled;
    const baseQuery = { removed: false };
    const query = enabled !== undefined ? { ...baseQuery, enabled } : baseQuery;

    const scopedQuery = limitToCreatedBy(Model, req, query);
    const result = await Model.find(scopedQuery)
      .sort({ created: sort })
      .populate()
      .exec();

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
    throw error;
  }
};

module.exports = listAll;
