const { sanitizeObject } = require('@/utils/validation');
const ownership = require('./ownership');
const { limitToCreatedBy } = ownership;

const read = async (Model, req, res) => {
  try {
    const query = limitToCreatedBy(Model, req, { _id: req.params.id });

    const result = await Model.findOne(query).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found the document',
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

module.exports = read;
