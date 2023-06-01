const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard/dashboard.controller');


router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is dashboard page!"
    });
});

router.get('/get', DashboardController.get);
router.get('/getTodaysReportDetails', DashboardController.getTodaysDetails);
module.exports = router;