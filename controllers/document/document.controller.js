const DocumentModel = require('../../models/document.model');
const Old_DocumentModel = require('../../models/old_document.model');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const multer = require('multer');
const fs = require("fs");
const path = require("path");
const zip = require('express-zip');

let DIR_PATH = "./uploads/";

const store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: store }).array('files[]');

exports.store = async (req, res) => {

    DIR_PATH = "./uploads/";
    const current_timestamp = Date.now();
    DIR_PATH = DIR_PATH + '/' + current_timestamp;

    if (!fs.existsSync(DIR_PATH)) {
        fs.mkdirSync(DIR_PATH);
    }

    upload(req, res, async function (err) {
        if (err) {
            if (!res.headersSent) {
                return res.status(501).json({ error: err });
            }
        }

        let uploaded_files = [];
        let document_names = [];
        let errorsArray = [];

        if (req.files) {
            let counter = 1;

            const uploadedFiles = req.files;

            for (let index = 0; index < uploadedFiles.length; index++) {
                const element = uploadedFiles[index];

                uploaded_files.push(element.filename);
                const splitedName = element.filename.split('.');
                document_names.push(splitedName[0]);
                const document_path = `/uploads/${current_timestamp}/${element.filename}`;

                await DocumentModel.count({
                    where: { policy_no: splitedName[0] }
                    //	where: { policy_no: { [Op.like]: '%' + splitedName[0] + '%' } }
                }).then(async (count) => {

                    await DocumentModel.create({
                        policy_no: splitedName[0],
                        document_name: element.filename,
                        document_directory: current_timestamp,
                        document_path: document_path,
                        document_size: element.size,
                        document_type: splitedName[1],
                        created_at: new Date(),
                    }).then(result => {

                        if (counter == req.files.length) {
                            if (!res.headersSent) {
                                res.json({
                                    status: 200,
                                    message: 'Documents uploded successfully! Errors are in data node.',
                                    data: errorsArray
                                });
                            }
                        }
                        counter++;

                    }).catch(error => {
                        errorsArray.push({ policy_no: splitedName[0], message: error });
                        if (counter == req.files.length) {
                            if (!res.headersSent) {
                                res.json({
                                    status: 200,
                                    message: 'Documents uploded successfully! Errors are in data node.',
                                    data: errorsArray
                                });
                            }
                        }
                        counter++;
                    });

                    // if (count > 0) {

                    //     await DocumentModel.destroy({
                    //         where: { policy_no: splitedName[0] }
                    //         //	where: { policy_no: { [Op.like]: '%' + splitedName[0] + '%' } }
                    //     }).then(result => {

                    //         if (counter == req.files.length) {
                    //             if (!res.headersSent) {
                    //                 res.json({
                    //                     status: 200,
                    //                     message: 'Documents uploded successfully! Errors are in data node.',
                    //                     data: errorsArray
                    //                 });
                    //             }
                    //         }
                    //         counter++;

                    //     }).catch(error => {
                    //         errorsArray.push({ policy_no: splitedName[0], message: error });
                    //         if (counter == req.files.length) {
                    //             if (!res.headersSent) {
                    //                 res.json({
                    //                     status: 200,
                    //                     message: 'Documents uploded successfully! Errors are in data node.',
                    //                     data: errorsArray
                    //                 });
                    //             }
                    //         }
                    //         counter++;
                    //     });
                    // } else {

                    //     await DocumentModel.create({
                    //         policy_no: splitedName[0],
                    //         document_name: element.filename,
                    //         document_directory: current_timestamp,
                    //         document_path: document_path,
                    //         document_size: element.size,
                    //         document_type: splitedName[1],
                    //         created_at: new Date(),
                    //     }).then(result => {

                    //         if (counter == req.files.length) {
                    //             if (!res.headersSent) {
                    //                 res.json({
                    //                     status: 200,
                    //                     message: 'Documents uploded successfully! Errors are in data node.',
                    //                     data: errorsArray
                    //                 });
                    //             }
                    //         }
                    //         counter++;

                    //     }).catch(error => {
                    //         errorsArray.push({ policy_no: splitedName[0], message: error });
                    //         if (counter == req.files.length) {
                    //             if (!res.headersSent) {
                    //                 res.json({
                    //                     status: 200,
                    //                     message: 'Documents uploded successfully! Errors are in data node.',
                    //                     data: errorsArray
                    //                 });
                    //             }
                    //         }
                    //         counter++;
                    //     });

                    // }

                }).catch(error => {
                    errorsArray.push({ policy_no: splitedName[0], message: error });
                    if (counter == req.files.length) {
                        if (!res.headersSent) {
                            res.json({
                                status: 200,
                                message: 'Documents uploded successfully! Errors are in data node.',
                                data: errorsArray
                            });
                        }
                    }
                    counter++;
                });

            }
        } else {
            if (!res.headersSent) {
                res.json({
                    status: 201,
                    message: 'There re no documents to upload.',
                    data: []
                });
            }
        }
    });
}

exports.get_selected_files = async (req, res) => {



    const _policies = req.query.policies;
    let _policiesArray = _policies ? _policies.split(',') : [];

    _policiesArray = _policiesArray.map(_policy => _policy.trim());

    let policies = await Old_DocumentModel.findAll({
        where: {
            [Op.or]: { policy_no: _policiesArray }
        }, raw: true
    }).then(policies => {

        return policies;

        // if (!res.headersSent) {
        //     return res.json({
        //         status: 200,
        //         message: '1Policies are in data node.',
        //         data: policies
        //     });
        // }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

    let new_policies = await DocumentModel.findAll({
        where: {
            [Op.or]: { policy_no: _policiesArray }
        }, raw: true
    }).then(policies => {

        return policies;


    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

    if (new_policies.length > 0) {
        new_policies.forEach(element => {
            policies.push(element);
        });

        if (!res.headersSent) {
            return res.json({
                status: 200,
                message: '1Policies are in data node.',
                data: policies
            });
        }
    } else {
        if (!res.headersSent) {
            return res.json({
                status: 200,
                message: '1Policies are in data node.',
                data: policies
            });
        }
    }




}


exports.download_selected_files = async (req, res) => {

    const policies = req.query.policies;
    let policiesArray = policies ? policies.split(',') : [];

    policiesArray = policiesArray.map(policy => policy.trim());
    let files = [];
    let _old_files = [];
    let _new_files = [];


    await Old_DocumentModel.findAll({
        where: {
            [Op.or]: { policy_no: policiesArray }
        }
    }).then(policies => {

        if (policies.length > 0) {


            for (let index = 0; index < policies.length; index++) {
                let policy = policies[index];
                let file = './uploads/' + policy.document_directory + '/' + policy.document_name;
                _old_files.push({ path: file, name: policy.document_name });

                // return _old_files;
                // if ((index + 1) == policies.length) {
                //     return zip(_old_files);
                // }

            }
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });


    await DocumentModel.findAll({
        where: {
            [Op.or]: { policy_no: policiesArray }
        }
    }).then(policies => {

        if (policies.length > 0) {

            for (let index = 0; index < policies.length; index++) {
                let policy = policies[index];
                let file = './uploads/' + policy.document_directory + '/' + policy.document_name;
                _new_files.push({ path: file, name: policy.document_name });

            }
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

    if (_new_files.length > 0) {
        _new_files.forEach(element => {
            files.push(element);
        });
    }
    if (_old_files.length > 0) {
        _old_files.forEach(element => {
            files.push(element);
        });
    }


    if (files.length > 0) {
        res.zip(files);
    } else {
        if (!res.headersSent) {
            return res.json({
                status: 200,
                data: files.length,
                message: 'There are no policies found to download.',
            });
        }
    }




}

exports.old_get_selected_files = (req, res) => {

    const policies = req.query.policies;
    let policiesArray = policies ? policies.split(',') : [];

    policiesArray = policiesArray.map(policy => policy.trim());

    Old_DocumentModel.findAll({
        where: {
            [Op.or]: { policy_no: policiesArray }
        }
    }).then(policies => {

        if (!res.headersSent) {
            return res.json({
                status: 200,
                message: '12Policies are in data node.',
                data: policies
            });
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

}
exports.old_download_selected_files = (req, res) => {

    const policies = req.query.policies;
    let policiesArray = policies ? policies.split(',') : [];

    policiesArray = policiesArray.map(policy => policy.trim());

    Old_DocumentModel.findAll({
        where: {
            [Op.or]: { policy_no: policiesArray }
        }
    }).then(policies => {

        if (policies.length > 0) {
            let files = [];
            for (let index = 0; index < policies.length; index++) {
                const policy = policies[index];
                const file = './uploads/' + policy.document_directory + '/' + policy.document_name;
                files.push({ path: file, name: policy.document_name });

                if ((index + 1) == policies.length) {
                    res.zip(files);
                }

            }
        } else {
            if (!res.headersSent) {
                return res.json({
                    status: 200,
                    message: 'There are no policies found to download.',
                });
            }
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 400,
                message: error
            });
        }
    });

}