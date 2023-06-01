const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');

const DeliveryModel = require('../models/delivery.model');

exports.sendEmail = (template, name, email, policy, link, document_name, start_date, end_date, premium_amount, member_id) => {
    // console.log("In EMail");
    let html_content = fs
        .readFileSync(template, {
            encoding: "utf-8"
        })
        .toString();
    let transport = nodemailer.createTransport({

        host: "pnq75.balasai.com", //mail.dpmprinters.com",
        port: 465,
        secure: true,
        auth: {
            user: "aditya.birla@dpmprinters.com",
            pass: "dpmprintersab2013"
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    var template = handlebars.compile(html_content);
    var replacements = {
        name: name,
        policy: policy,
        link: link,
        start_date: start_date,
        end_date: end_date,
        total: "₹ " + premium_amount,
    };
    var htmlToSend = template(replacements);

    const message = {
        from: "Aditya Birla Health Insurance Policy <aditya.birla@dpmprinters.com>", // Sender address
        to: email, // List of recipients
        subject: "Aditya Birla | Policy Details", // Subject line
        html: htmlToSend, // Plain text body
        // attachments: {
        //     name: document_name,
        //     path: link
        // }
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err);
            return false;
        }

        DeliveryModel.update({
            email_status: 1,
        }, {
            where: { policy_no: policy }
        }).then(updated => {
            console.log(updated);
        }).catch(error => {
            console.log(error);
        });

        return true;
    });
}