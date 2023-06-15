
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Client = require('ftp');
const DocumentModel = require('../../models/document.model');
const ftp_helper = require('../../helper/ftp.helper');
const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
var Client = require('ftp');
var ftpClient = new Client();

let policies_count = 0;

exports.read_docs = async (req, res) => {
    const readerPath = Object.keys(req.query).includes('path') ? req.query.path : '';

    try {
        const fileList = await new Promise((resolve, reject) => {

            ftp_helper.syncReader(`${readerPath}`, (list) => {
                resolve(list);
            }, (err) => {
                reject(err);
            });
        })

        await DocumentModel.bulkCreate(fileList);
        exec('sudo pm2 restart 0', (error, stdout, stderr) => {
            if (error) {
              console.log(error);
              return;
            }
          
            console.log(stdout);
          });
        return res.status(200).json({ status: 200, message: 'Files Uploaded', data: fileList })
    } catch (error) {
        if (error == 'Not Found')
            return res.status(404).json({ status: 404, message: "Invalid Path" })

        return res.status(500).json({ status: 500, message: error })
    }
}


exports.download_docs = async (req, res) => {
    const policies = req.query.policies;
    let policiesArray = policies ? policies.split(',') : [];

    policiesArray = policiesArray.map(policy => policy.trim());
    let files = [];
    let _policies = [];

    const fileDetails = await DocumentModel.findOne({
        where: {
            [Op.or]: { policy_no: policiesArray },
        }, raw: true
    }).then(async result => { return result }).catch(error => console.log(error));

    if (fileDetails) {

        await syncFile(fileDetails)

        setTimeout(() => {

            let file = './downloads/' + fileDetails.document_name;


            if (fs.existsSync(file)) { res.download(file) }
            else { res.status(500).send('Download Failed. Please try again'); }


        }, 2000);

    }
    else { return res.status(500).send('Internal Server Error. Please contact your Administrator.'); }

}




async function syncFile(policies) {

    let files = [];

    // console.log(policies, "policies");

    try {
        ftpClient.connect({
            host: '103.249.242.123',
            user: "pankaj",
            password: "Pankaj@123",
            port: 21
        });


        ftpClient.on('ready', async () => {

            const localPath = `${path.join('./downloads')}/${policies.document_name}`;
            const remotePath = `/PDMS${policies.document_path}`;


            ftpClient.get(remotePath, (err, stream) => {


                if (err) {
                    console.error(`Error retrieving file ${policies.document_name}:`, err);
                } else {

                    stream.once('close', function () { ftpClient.end(); });

                    stream.pipe(fs.createWriteStream(localPath));
                    return true;

                }

            });
            // });

        });



    } catch (error) {
        console.error('Error retrieving file list:', error);
    }
}




