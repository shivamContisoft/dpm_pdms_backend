const config = require('../../config/jwt.secret');
const UserModel = require('../../models/user.model');
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
const Op = Sequelize.Op;
const fs = require('fs');
const path = require('path');

exports.authenticateUser = (req, res) => {
    // console.log("req", req)
    if (!req.body.email || !req.body.password) {
        res.json({
            status: 201,
            message: 'Invalid credentials are entered!',
        });
    } else {

        const email = req.body.email;
        const password = req.body.password;
        console.log("email", email)
        console.log("password", password)
        const potentialUser = {
            where: {
                email_id: email,
                password: password,
            },
        };
        UserModel.findOne(potentialUser).then((user) => {
            console.log("user", JSON.stringify(user))
            if (!user) {
                return res.json({
                    status: 201,
                    message: 'Invalid credentials found!',
                });
            } else {

                let token = jwt.sign({ email: email, user_id: user.id },
                    config.secret, {
                        expiresIn: '365d' // expires in 24 hours
                    });

                res.json({
                    status: 200,
                    message: 'Authentication successfull!',
                    token: token,
                    user: user,
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: err,
            });
        });
    }
};

exports.resetpassword = (req, res) => {
    if (!req.body.email) {
        res.json({
            status: 201,
            message: 'Invalid details provided!',
        });
    } else {
        const email = req.body.email;
        const potentialUser = {
            where: {
                email_id: email,
            },
        };
        UserModel.findOne(potentialUser).then((user) => {
            if (!user) {
                return res.json({
                    status: 201,
                    message: 'Invalid details found!',
                });
            } else {
                const newPassword = generatePassword();

                UserModel.update({
                    password: newPassword
                }, {
                    where: { id: user.id }
                }).then(result => {
                    sendNewPasswordMail(email, user.first_name, newPassword);
                }).then(result => {
                    res.json({
                        status: 200,
                        message: 'Password sent on mail!',
                    });
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: err,
            });
        });
    }
}

exports.changepassword = (req, res) => {
    if (!req.body.old_password || !req.body.new_password) {
        res.json({
            status: 201,
            message: 'Please check old password!',
        });
    } else {
        const newPassword = req.body.new_password;
        const potentialUser = {
            where: {
                password: req.body.old_password,
            },
        };
        UserModel.findOne(potentialUser).then((user) => {
            if (!user) {
                return res.json({
                    status: 201,
                    message: 'Invalid details found!',
                });
            } else {
                UserModel.update({
                    password: newPassword
                }, {
                    where: { id: user.id }
                }).then(result => {
                    res.json({
                        status: 200,
                        message: 'Password updated successfully!',
                    });
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: err,
            });
        });
    }
}


function sendNewPasswordMail(email, username, password) {
    let html_content = fs
        .readFileSync(path.resolve('./resources/email_templates/resetpassword.template.html'), {
            encoding: "utf-8"
        })
        .toString();
    let transport = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true,
        auth: {
            user: "alert@trackpayout.com",
            pass: "Reminder@2021"
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    //create html template from file
    var template = handlebars.compile(html_content);
    var replacements = {
        username: username,
        password: password,
    };
    var htmlToSend = template(replacements);

    const message = {
        from: "alert@trackpayout.com", // Sender address
        to: email, // List of recipients
        subject: "Trackpayout | New Password Request", // Subject line
        html: htmlToSend // Plain text body
    };

    transport.sendMail(message, function(err, info) {
        if (err) {
            return false;
        }
        return true;
    });
}

function generatePassword() {
    var len = 8;
    var arr = '0123456789abcdefghijklmnopABCDEFGHIJKLMNOP!@#$%&*()';
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans +=
            arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}