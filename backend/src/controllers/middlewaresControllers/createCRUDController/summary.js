const ownership = require('./ownership');
const { limitToCreatedBy } = ownership;

const summary = async (Model, req, res) => {
  try {
    const baseQuery = limitToCreatedBy(Model, req);

    let filterCondition = {};
    if (req.query.filter && req.query.equal !== undefined && req.query.equal !== '') {
      filterCondition[req.query.filter] = req.query.equal;
    }

    const countFilterPromise = Model.countDocuments({
      ...baseQuery,
      ...filterCondition,
    }).exec();
    const countAllPromise = Model.countDocuments(baseQuery).exec();

    const [countFilter, countAllDocs] = await Promise.all([countFilterPromise, countAllPromise]);

    return res.status(200).json({
      success: true,
      result: { countFilter, countAllDocs },
      message: 'Successfully counted documents',
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

module.exports = summary;
