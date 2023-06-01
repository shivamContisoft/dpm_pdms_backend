const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/member/member.controller');


router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is member page!"
    });
});

router.post('/create', MemberController.create);
router.get('/get-all', MemberController.get_all);

router.get('/send-email', MemberController.sendEmail);
router.get('/send-sms', MemberController.sendSMS);
router.get('/send-wapp', MemberController.sendWApp);

module.exports = router;