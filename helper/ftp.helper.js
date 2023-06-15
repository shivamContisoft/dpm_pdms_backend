var Client = require('ftp');
var ftpClient = new Client();

const fs = require("fs");
const path = require("path");
const zip = require('express-zip');

exports.syncReader = (path, resolver, rejector) => {
    ftpClient.connect({
        host: '103.249.242.123',
        user: "pankaj",
        password: "Pankaj@123",
        port: 21
    });

    ftpClient.on('ready', () => {
        ftpClient.list(path, async (err, list) => {
            if (err) { rejector('Not Found') }
            else {

                let restructured_Array = list.map(item => {
                    return {
                        policy_no: item.name.split('.')[0],
                        document_name: item.name,
                        document_directory: path.split('/')[3],
                        document_path: '/' + path.split('/')[2] + '/' + path.split('/')[3] + '/' + item.name,
                        document_size: item.size,
                        document_type: item.name.split('.')[1],
                        created_at: new Date().toISOString().split('T')[0],
                    };
                });
                resolver(restructured_Array);
                ftpClient.end();
            }
        })
    });
}

