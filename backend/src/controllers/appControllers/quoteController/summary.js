const mongoose = require('mongoose');

const Model = mongoose.model('Quote');

const summary = async (req, res) => {
  const statuses = ['draft', 'pending', 'sent', 'negotiation', 'accepted', 'declined', 'cancelled'];

  const response = await Model.aggregate([
    {
      $match: {
        removed: false,
      },
    },
    {
      $facet: {
        totalQuote: [
          {
            $group: {
              _id: null,
              total: {
                $sum: '$total',
              },
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              total: '$total',
              count: '$count',
            },
          },
        ],
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              _id: 0,
              status: '$_id',
              count: '$count',
            },
          },
        ],
      },
    },
  ]);

  const totalQuotes = response[0].totalQuote?.[0] || { total: 0, count: 0 };
  const statusResult = response[0].statusCounts || [];

  const performance = statuses.map((status) => {
    const found = statusResult.find((item) => item.status === status);
    const count = found?.count || 0;

    return {
      status,
      count,
      percentage: totalQuotes.count > 0 ? Math.round((count / totalQuotes.count) * 100) : 0,
    };
  });

  return res.status(200).json({
    success: true,
    result: {
      total: totalQuotes.total,
      performance,
    },
    message: 'Successfully found all quotes',
  });
};

module.exports = summary;
