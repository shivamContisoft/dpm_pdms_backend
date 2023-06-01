const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user/user.controller');


router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is user page!"
    });
});

router.post('/create', UserController.create);
router.post('/update', UserController.update);
router.post('/update-password', UserController.update_password);

router.get('/get-all', UserController.get_all);
router.get('/get-one', UserController.get_one);

module.exports = router;