const express = require('express');
const router = express.Router();
const IssuanceController = require('../controllers/issuance/issuance.controller');


router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is member page!"
    });
});

router.post('/create', IssuanceController.create);
// router.get('/get-all', MemberController.get_all);

// router.get('/send-email', MemberController.sendEmail);
// router.get('/send-sms', MemberController.sendSMS);
// router.get('/send-wapp', MemberController.sendWApp);
router.get('/sms-repeater',IssuanceController.sendSMS);
module.exports = router;