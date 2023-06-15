const express = require('express');
const router = express.Router();
const ftpfileUploadController = require('../controllers/ftpfile_upload/upload_ftp_file');


router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is document page!"
    });
});


 

router.get('/read_docs', ftpfileUploadController.read_docs);

router.get('/download_docs', ftpfileUploadController.download_docs);




module.exports = router;