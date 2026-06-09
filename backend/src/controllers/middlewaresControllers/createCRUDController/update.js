const { sanitizeObject } = require('@/utils/validation');
const ownership = require('./ownership');
const { limitToCreatedBy } = ownership;

const update = async (Model, req, res) => {
  try {
    const sanitizedBody = sanitizeObject(req.body);
    const result = await Model.findOneAndUpdate(
      limitToCreatedBy(Model, req, { _id: req.params.id }),
      sanitizedBody,
      {
        new: true,
        runValidators: true,
      }
    ).exec();
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
      message: 'Successfully updated the document',
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

module.exports = update;
