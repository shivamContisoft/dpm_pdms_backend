const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/document/document.controller');


router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is document page!"
    });
});

router.post('/store', DocumentController.store);
router.get('/get-documents', DocumentController.get_selected_files);
router.get('/download', DocumentController.download_selected_files);


router.get('/old-documents', DocumentController.old_get_selected_files);
router.get('/old-download', DocumentController.old_download_selected_files);


module.exports = router;