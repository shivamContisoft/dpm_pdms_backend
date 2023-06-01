const MemberModel = require("../../models/member.model");
const MemberDumpModel = require("../../models/member-dump.model");
const DocumentModel = require("../../models/document.model");
const DeliveryStatus = require("../../models/delivery.model");

const EmailHelper = require("../../helper/email.helper");
const SmsHelper = require("../../helper/sms.helper");
const WappHelper = require("../../helper/wapp.helper");

const nodemailer = require('nodemailer');
const https = require("https");
const url = require("url");
const request = require("request");


exports.send = (req, res) => {

    MemberDumpModel.findAll({
        limit: 1
    }).then(members => {

        if (members.length > 0) {

            var hostname = "http://" + req.headers.host.split(":")[0];
            hostname = hostname + "/pdms/backend";
            let errorsArray = [];
            for (let index = 0; index < members.length; index++) {
                const element = members[index];
                const delivery_status = 0;
                let {
                    policy_no,
                    member_name,
                    member_email,
                    member_sms_contact,
                    member_wapp_contact,
                    member_address,
                    member_city,
                    start_date,
                    end_date,
                    premium_amount,
                } = element;


                MemberModel.findOne({
                    where: { policy_no: policy_no },
                }).then((member) => {
                    if (member) {
                        const member_id = member.id;

                        DeliveryStatus.findOne({
                            where: { policy_no: policy_no },
                        }).then(delivery => {

                            if (delivery) {
                                DocumentModel.findOne({
                                    where: { policy_no: policy_no },
                                }).then((doc) => {

                                    MemberDumpModel.destroy({
                                        where: { policy_no: policy_no }
                                    }).then(destroyed => {

                                        if (member_email != "" && member_email != null) {
                                            EmailHelper.sendEmail(
                                                "./resources/email_templates/new_policydetails.template.html",
                                                member_name,
                                                member_email,
                                                policy_no,
                                                hostname + doc.document_path,
                                                doc.document_name,
                                                start_date,
                                                end_date,
                                                premium_amount,
                                                member_id
                                            );
                                        }

                                        if (member_sms_contact != '' && member_sms_contact != null && member_sms_contact.length === 10 && (premium_amount != null && premium_amount != "")) {
                                            const msg = `Dear ${member_name} ! Your GHI ${policy_no} with Premium of Rs. ${premium_amount} from ABHI is active till ${end_date} . Access COI on link .Call 18002707000 for help. ${hostname + doc.document_path} Thanks DPMPRT`;
                                            // const mhg = "http://login.afrapro.in/api/mt/SendSMS?user=dineshmehta1508@gmail.com&password=12345678&senderid=DPMPRT&channel=Trans&DCS=0&flashsms=0&number=919096016308&text=${msg}&route=15&DLTTemplateId=1207163031484175403&PEID=1201159724306525673";
                                            request(
                                                `http://198.24.149.4/API/pushsms.aspx?loginID=DPMPrinters&password=Chea@1964&mobile=${member_sms_contact}&text=${msg}&senderid=DPMPRT&route_id=2&Unicode=0&Template_id=1207162980080624598`,
                                                function (error, response, body) {
                                                    console.log(body);
                                                    if (!error && response.statusCode === 200) {
                                                        DeliveryStatus.update({
                                                            sms_status: 1,
                                                            sms_sid: JSON.parse(body).Transaction_ID
                                                        }, {
                                                            where: { policy_no: policy_no }
                                                        }).then(updated => {
                                                        }).catch(error => {
                                                            console.log(error);
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                        if (member_wapp_contact != '' && member_wapp_contact != null && member_wapp_contact.length >= 10 && (premium_amount != null && premium_amount != "")) {

                                            if (member_wapp_contact.length == 10) {
                                                member_wapp_contact = "91" + member_wapp_contact;
                                            }
                                            const msg = `Dear ${member_name}, Your GHI ${policy_no} with premiun Rs. ${premium_amount} from Aditya Birla Health Insurance is now active till ${end_date}. Call 1800 270 7000 for help. Access Network Hospital list on https://bit.ly/3nwf2Qc`;
                                            request(
                                                `http://182.75.84.114/admin/Sendwhatsapp/insert_whatsapp_api1?username=dineshmehta1508@gmail.com&password=12345678&mobile_no=${member_wapp_contact}&campaign_name=API&message=${msg}&uploaded1=http://pfm.contisofttechno.com/pdms/backend/${doc.document_path}`,
                                                function (error, response, body) {
                                                    console.log(body);
                                                    if (!error && response.statusCode === 200) {
                                                        DeliveryStatus.update({
                                                            wapp_status: 1,
                                                            wapp_sid: JSON.parse(body).request_id
                                                        }, {
                                                            where: { policy_no: policy_no }
                                                        }).then(updated => {
                                                        }).catch(error => {
                                                            console.log(error);
                                                        });
                                                    }
                                                }
                                            );
                                        }

                                        if (index + 1 == members.length) {
                                            if (!res.headersSent) {
                                                return res.json({
                                                    status: 200,
                                                    message: "Find errors array in data node",
                                                    data: errorsArray,
                                                });
                                            }
                                        }

                                    }).catch(error => {
                                        errorsArray.push({
                                            policy_no: element.policy_no,
                                            message: error,
                                        });
                                        if (index + 1 == members.length) {
                                            if (!res.headersSent) {
                                                return res.json({
                                                    status: 200,
                                                    message: "Fi nd errors array in data node",
                                                    data: errorsArray,
                                                });
                                            }
                                        }
                                    });
                                }).catch((error) => {
                                    errorsArray.push({
                                        policy_no: element.policy_no,
                                        message: error,
                                    });
                                    if (index + 1 == members.length) {
                                        if (!res.headersSent) {
                                            return res.json({
                                                status: 200,
                                                message: "Find errors array in data node",
                                                data: errorsArray,
                                            });
                                        }
                                    }
                                });

                            } else {
                                DeliveryStatus.create({
                                    member_id,
                                    policy_no,
                                    sms_status: 0,
                                    wapp_status: 0,
                                    email_status: 0,
                                    created_at: new Date(),
                                }).then((result) => {
                                    DocumentModel.findOne({
                                        where: { policy_no: policy_no },
                                    }).then((doc) => {

                                        MemberDumpModel.destroy({
                                            where: { policy_no: policy_no }
                                        }).then(destroyed => {

                                            if (member_email != "" && member_email != null) {
                                                EmailHelper.sendEmail(
                                                    "./resources/email_templates/new_policydetails.template.html",
                                                    member_name,
                                                    member_email,
                                                    policy_no,
                                                    hostname + doc.document_path,
                                                    doc.document_name,
                                                    start_date,
                                                    end_date,
                                                    premium_amount,
                                                    member_id
                                                );
                                            }

                                            if (member_sms_contact != '' && member_sms_contact != null && member_sms_contact.length === 10 && (premium_amount != null && premium_amount != "")) {
                                                const msg = `Dear ${member_name} ! Your GHI ${policy_no} with Premium of Rs. ${premium_amount} from ABHI is active till ${end_date} . Access COI on link .Call 18002707000 for help. ${hostname + doc.document_path} Thanks DPMPRT`;
                                                // const mhg = "http://login.afrapro.in/api/mt/SendSMS?user=dineshmehta1508@gmail.com&password=12345678&senderid=DPMPRT&channel=Trans&DCS=0&flashsms=0&number=919096016308&text=${msg}&route=15&DLTTemplateId=1207163031484175403&PEID=1201159724306525673";
                                                request(
                                                    `http://198.24.149.4/API/pushsms.aspx?loginID=DPMPrinters&password=Chea@1964&mobile=${member_sms_contact}&text=${msg}&senderid=DPMPRT&route_id=2&Unicode=0&Template_id=1207162980080624598`,
                                                    function (error, response, body) {
                                                        if (!error && response.statusCode === 200) {
                                                            DeliveryStatus.update({
                                                                sms_status: 1,
                                                                sms_sid: JSON.parse(body).Transaction_ID
                                                            }, {
                                                                where: { policy_no: policy_no }
                                                            }).then(updated => {
                                                            }).catch(error => {
                                                                console.log(error);
                                                            });
                                                        }
                                                    }
                                                );
                                            }

                                            if (member_wapp_contact != '' && member_wapp_contact != null && member_wapp_contact.length >= 10 && (premium_amount != null && premium_amount != "")) {

                                                if (member_wapp_contact.length == 10) {
                                                    member_wapp_contact = "91" + member_wapp_contact;
                                                }
                                                const msg = `Dear ${member_name}, Your GHI ${policy_no} with premiun Rs. ${premium_amount} from Aditya Birla Health Insurance is now active till ${end_date}. Call 1800 270 7000 for help. Access Network Hospital list on https://bit.ly/3nwf2Qc`;
                                                request(
                                                    `http://182.75.84.114/admin/Sendwhatsapp/insert_whatsapp_api1?username=dineshmehta1508@gmail.com&password=12345678&mobile_no=${member_wapp_contact}&campaign_name=API&message=${msg}&uploaded1=http://pfm.contisofttechno.com/pdms/backend/${doc.document_path}`,
                                                    function (error, response, body) {
                                                        if (!error && response.statusCode === 200) {
                                                            DeliveryStatus.update({
                                                                wapp_status: 1,
                                                                wapp_sid: JSON.parse(body).request_id
                                                            }, {
                                                                where: { policy_no: policy_no }
                                                            }).then(updated => {
                                                            }).catch(error => {
                                                                console.log(error);
                                                            });
                                                        }
                                                    }
                                                );
                                            }

                                            if (index + 1 == members.length) {
                                                if (!res.headersSent) {
                                                    return res.json({
                                                        status: 200,
                                                        message: "Find errors array in data node",
                                                        data: errorsArray,
                                                    });
                                                }
                                            }

                                        }).catch(error => {
                                            errorsArray.push({
                                                policy_no: element.policy_no,
                                                message: error,
                                            });
                                            if (index + 1 == members.length) {
                                                if (!res.headersSent) {
                                                    return res.json({
                                                        status: 200,
                                                        message: "Find errors array in data node",
                                                        data: errorsArray,
                                                    });
                                                }
                                            }
                                        });

                                    }).catch((error) => {
                                        errorsArray.push({
                                            policy_no: element.policy_no,
                                            message: error,
                                        });
                                        if (index + 1 == members.length) {
                                            if (!res.headersSent) {
                                                return res.json({
                                                    status: 200,
                                                    message: "Find errors array in data node",
                                                    data: errorsArray,
                                                });
                                            }
                                        }
                                    });
                                }).catch((error) => {
                                    errorsArray.push({
                                        policy_no: element.policy_no,
                                        message: error,
                                    });
                                    if (index + 1 == members.length) {
                                        if (!res.headersSent) {
                                            return res.json({
                                                status: 200,
                                                message: "Find errors array in data node",
                                                data: errorsArray,
                                            });
                                        }
                                    }
                                });
                            }

                        }).catch(error => {
                            console.log(error);
                        });

                    } else {
                        MemberModel.create({
                            policy_no,
                            member_name,
                            member_email,
                            member_sms_contact,
                            member_wapp_contact,
                            member_address,
                            member_city,
                            start_date,
                            end_date,
                            premium_amount,
                            delivery_status,
                            created_at: new Date(),
                            updated_at: new Date(),
                        }).then((result) => {
                            const member_id = result.id;

                            DeliveryStatus.create({
                                member_id,
                                policy_no,
                                sms_status: 0,
                                wapp_status: 0,
                                email_status: 0,
                                created_at: new Date(),
                            }).then((result) => {
                                DocumentModel.findOne({
                                    where: { policy_no: policy_no },
                                }).then((doc) => {

                                    MemberDumpModel.destroy({
                                        where: { policy_no: policy_no }
                                    }).then(destroyed => {

                                        if (member_email != "" && member_email != null) {
                                            EmailHelper.sendEmail(
                                                "./resources/email_templates/new_policydetails.template.html",
                                                member_name,
                                                member_email,
                                                policy_no,
                                                hostname + doc.document_path,
                                                doc.document_name,
                                                start_date,
                                                end_date,
                                                premium_amount,
                                                member_id
                                            );
                                        }

                                        if (member_sms_contact != '' && member_sms_contact != null && member_sms_contact.length === 10 && (premium_amount != null && premium_amount != "")) {
                                            const msg = `Dear ${member_name} ! Your GHI ${policy_no} with Premium of Rs. ${premium_amount} from ABHI is active till ${end_date} . Access COI on link .Call 18002707000 for help. ${hostname + doc.document_path} Thanks DPMPRT`;
                                            // const mhg = "http://login.afrapro.in/api/mt/SendSMS?user=dineshmehta1508@gmail.com&password=12345678&senderid=DPMPRT&channel=Trans&DCS=0&flashsms=0&number=919096016308&text=${msg}&route=15&DLTTemplateId=1207163031484175403&PEID=1201159724306525673";
                                            request(
                                                `http://198.24.149.4/API/pushsms.aspx?loginID=DPMPrinters&password=Chea@1964&mobile=${member_sms_contact}&text=${msg}&senderid=DPMPRT&route_id=2&Unicode=0&Template_id=1207162980080624598`,
                                                function (error, response, body) {
                                                    if (!error && response.statusCode === 200) {
                                                        DeliveryStatus.update({
                                                            sms_status: 1,
                                                            sms_sid: JSON.parse(body).Transaction_ID
                                                        }, {
                                                            where: { policy_no: policy_no }
                                                        }).then(updated => {
                                                        }).catch(error => {
                                                            console.log(error);
                                                        });
                                                    }
                                                }
                                            );
                                        }

                                        if (member_wapp_contact != '' && member_wapp_contact != null && member_wapp_contact.length >= 10 && (premium_amount != null && premium_amount != "")) {

                                            if (member_wapp_contact.length == 10) {
                                                member_wapp_contact = "91" + member_wapp_contact;
                                            }
                                            const msg = `Dear ${member_name}, Your GHI ${policy_no} with premiun Rs. ${premium_amount} from Aditya Birla Health Insurance is now active till ${end_date}. Call 1800 270 7000 for help. Access Network Hospital list on https://bit.ly/3nwf2Qc`;
                                            request(
                                                `http://182.75.84.114/admin/Sendwhatsapp/insert_whatsapp_api1?username=dineshmehta1508@gmail.com&password=12345678&mobile_no=${member_wapp_contact}&campaign_name=API&message=${msg}&uploaded1=http://pfm.contisofttechno.com/pdms/backend/${doc.document_path}`,
                                                function (error, response, body) {
                                                    if (!error && response.statusCode === 200) {
                                                        DeliveryStatus.update({
                                                            wapp_status: 1,
                                                            wapp_sid: JSON.parse(body).request_id
                                                        }, {
                                                            where: { policy_no: policy_no }
                                                        }).then(updated => {
                                                        }).catch(error => {
                                                            console.log(error);
                                                        });
                                                    }
                                                }
                                            );
                                        }

                                        if (index + 1 == members.length) {
                                            if (!res.headersSent) {
                                                return res.json({
                                                    status: 200,
                                                    message: "Find errors array in data node",
                                                    data: errorsArray,
                                                });
                                            }
                                        }

                                    }).catch(error => {
                                        errorsArray.push({
                                            policy_no: element.policy_no,
                                            message: error,
                                        });
                                        if (index + 1 == members.length) {
                                            if (!res.headersSent) {
                                                return res.json({
                                                    status: 200,
                                                    message: "Find errors array in data node",
                                                    data: errorsArray,
                                                });
                                            }
                                        }
                                    });

                                }).catch((error) => {
                                    console.log(error);
                                    errorsArray.push({
                                        policy_no: element.policy_no,
                                        message: error,
                                    });
                                    if (index + 1 == members.length) {
                                        if (!res.headersSent) {
                                            return res.json({
                                                status: 200,
                                                message: "Find errors array in data node",
                                                data: errorsArray,
                                            });
                                        }
                                    }
                                });
                            }).catch((error) => {
                                console.log(error);
                                errorsArray.push({
                                    policy_no: element.policy_no,
                                    message: error,
                                });
                                if (index + 1 == members.length) {
                                    if (!res.headersSent) {
                                        return res.json({
                                            status: 200,
                                            message: "Find errors array in data node",
                                            data: errorsArray,
                                        });
                                    }
                                }
                            });
                        }).catch((error) => {
                            errorsArray.push({
                                policy_no: element.policy_no,
                                message: error,
                            });
                            if (index + 1 == members.length) {
                                if (!res.headersSent) {
                                    return res.json({
                                        status: 200,
                                        message: "Find errors array in data node",
                                        data: errorsArray,
                                    });
                                }
                            }
                        });
                    }
                }).catch((error) => {
                    errorsArray.push({
                        policy_no: element.policy_no,
                        message: error,
                    });
                    if (index + 1 == members.length) {
                        if (!res.headersSent) {
                            return res.json({
                                status: 200,
                                message: "Find errors array in data node",
                                data: errorsArray,
                            });
                        }
                    }
                });
            }

        } else {
            if (!res.headersSent) {
                return res.json({
                    status: 200,
                    message: "There are now members for sending emails/sms/wapp."
                });
            }
        }

    }).catch(error => {
        if (!res.headersSent) {
            return res.json({
                status: 401,
                message: error
            });
        }
    });

}


exports.sms_repeater = async (req, res) => {

    DeliveryStatus.belongsTo(MemberModel, { foreignKey: 'member_id' });
    const deliveries = await DeliveryStatus.findAll({ include: [{ model: MemberModel, attributes: ['member_name', 'member_sms_contact', 'start_date', 'end_date', 'premium_amount'] }], where: { sms_status: 0 }, limit: 1 }).then(deliveries => { return deliveries; }).catch(error => { console.log(error) });

    var hostname = "http://" + req.headers.host.split(":")[0];
    hostname = hostname + "/pdms/backend";

    for (let index = 0; index < deliveries.length; index++) {
        const delivery = deliveries[index];
        const member = delivery.pdms_member;

        const doc = await DocumentModel.findOne({ where: { policy_no: delivery.policy_no } }).then(doc => { return doc; }).catch(error => { error });

        if (member.member_sms_contact != '' && member.member_sms_contact != null && member.member_sms_contact.length === 10 && (member.premium_amount != null && member.premium_amount != "")) {
            const msg = `Dear ${member.member_name} ! Your GHI ${delivery.policy_no} with Premium of Rs. ${member.premium_amount} from ABHI is active till ${member.end_date} . Access COI on link .Call 18002707000 for help. ${hostname + doc.document_path} Thanks DPMPRT`;
            // const mhg = "http://login.afrapro.in/api/mt/SendSMS?user=dineshmehta1508@gmail.com&password=12345678&senderid=DPMPRT&channel=Trans&DCS=0&flashsms=0&number=919096016308&text=${msg}&route=15&DLTTemplateId=1207163031484175403&PEID=1201159724306525673";
            request(
                `http://198.24.149.4/API/pushsms.aspx?loginID=DPMPrinters&password=Chea@1964&mobile=9096016308&text=${msg}&senderid=DPMPRT&route_id=2&Unicode=0&Template_id=1207162980080624598`,
                function (error, response, body) {
                    console.log(body);
                    if (!error && response.statusCode === 200) {
                        DeliveryStatus.update({
                            sms_status: 1,
                            sms_sid: JSON.parse(body).Transaction_ID
                        }, {
                            where: { policy_no: delivery.policy_no }
                        }).then(updated => {
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
            );
        }
    }

    return res.json({
        status: 200,
        data: deliveries
    });
}



exports.wapp_repeater = async (req, res) => {

    DeliveryStatus.belongsTo(MemberModel, { foreignKey: 'member_id' });
    const deliveries = await DeliveryStatus.findAll({ include: [{ model: MemberModel, attributes: ['member_name', 'member_wapp_contact', 'start_date', 'end_date', 'premium_amount'] }], where: { wapp_status: 0 }, limit: 1 }).then(deliveries => { return deliveries; }).catch(error => { console.log(error) });

    var hostname = "http://" + req.headers.host.split(":")[0];
    hostname = hostname + "/pdms/backend";

    for (let index = 0; index < deliveries.length; index++) {
        const delivery = deliveries[index];
        const member = delivery.pdms_member;

        const doc = await DocumentModel.findOne({ where: { policy_no: delivery.policy_no } }).then(doc => { return doc; }).catch(error => { error });

        if (member.member_wapp_contact != '' && member.member_wapp_contact != null && member.member_wapp_contact.length >= 10 && (member.premium_amount != null && member.premium_amount != "")) {
            if (member.member_wapp_contact.length == 10) {
                member.member_wapp_contact = "91" + member.member_wapp_contact;
            }
            const msg = `Dear ${member.member_name}, Your GHI ${delivery.policy_no} with premiun Rs. ${member.premium_amount} from Aditya Birla Health Insurance is now active till ${member.end_date}. Call 1800 270 7000 for help. Access Network Hospital list on https://www.adityabirlacapital.com`;
            request(
                `http://182.75.84.114/admin/Sendwhatsapp/insert_whatsapp_api1?username=dineshmehta1508@gmail.com&password=12345678&mobile_no=919096016308&campaign_name=API&message=${msg}&uploaded1=http://pfm.contisofttechno.com/pdms/backend/${doc.document_path}`,
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        DeliveryStatus.update({
                            wapp_status: 1,
                            wapp_sid: JSON.parse(body).request_id
                        }, {
                            where: { policy_no: delivery.policy_no }
                        }).then(updated => {
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                }
            );
        }
    }

    return res.json({
        status: 200,
        data: deliveries
    });
}


exports.email_test = (req, res) => {

    let transport = nodemailer.createTransport({

        host: "mail.dpmprinters.com",
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

    const message = {
        from: "Aditya Birla Health Insurance Policy <aditya.birla@dpmprinters.com>", // Sender address
        to: 'pankaj@contisofttechno.com', // List of recipients
        subject: "Aditya Birla | Policy Details", // Subject line
        html: "<h1>Hello World</h1>", // Plain text body
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

        return res.json({ status: 200 });
    });
}