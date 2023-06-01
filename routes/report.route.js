const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report/report.controller');


router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is report page!"
    });
});

router.get('/get', ReportController.getAllTransactions);
router.get('/get-email', ReportController.getEmailTransactions);
router.get('/get-sms', ReportController.getSmsTransactions);
router.get('/get-wapp', ReportController.getWappTransactions);
router.get('/update-deliveries', ReportController.updateDeliveries);
// router.get('/get-delivery-report-by-date', ReportController.getDeliveryReportByDate);

module.exports = router;