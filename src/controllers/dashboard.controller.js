const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.user);

  return res.status(200).json({
    success: true,
    data: summary,
  });
});

module.exports = {
  getDashboardSummary,
};