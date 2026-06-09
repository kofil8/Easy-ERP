const ownership = require('./ownership');
const { limitToCreatedBy } = ownership;

const filter = async (Model, req, res) => {
  try {
    const filterField = req.query.filter;
    const filterValue = req.query.equal;

    if (!filterField || filterValue === undefined) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'filter not provided correctly',
      });
    }

    const query = limitToCreatedBy(Model, req, { [filterField]: filterValue });
    const result = await Model.find(query).exec();

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found documents',
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

module.exports = filter;
