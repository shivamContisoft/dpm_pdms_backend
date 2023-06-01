const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth/auth.controller');
const AuthMiddleware = require('../middlerwares/auth.moddleware');
const SenderController = require('../controllers/sender/sender.controller')

router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is api page!"
    });
});

router.get('/isauthorised', AuthMiddleware.checkToken, (req, res) => {
    return res.json({
        status: 200,
        message: 'User is authorised!'
    });
});

router.post('/authenticate', AuthController.authenticateUser);
router.post('/resetpassword', AuthController.resetpassword);
router.post('/changepassword', AuthController.changepassword);

router.use('/user', require('./user.route'));
router.use('/member', require('./member.route'));
router.use('/issuance', require('./issuance.route'));
router.use('/healthcheckup', require('./healthcheckup.route'));
router.use('/document', require('./document.route'));
router.use('/dashboard', require('./dashboard.route'));
router.use('/report', require('./report.route'));

router.get('/send', SenderController.send);
router.get('/sms-repeater', SenderController.sms_repeater);
router.get('/wapp-repeater', SenderController.wapp_repeater);
router.get('/tester', SenderController.email_test);



module.exports = router;