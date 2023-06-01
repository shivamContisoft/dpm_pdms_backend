const IssuanceModel = require("../../models/sms_delivery.model");
const MemberDumpModel = require("../../models/member-dump.model");
const DocumentModel = require("../../models/document.model");
const DeliveryStatus = require("../../models/delivery.model");

const EmailHelper = require("../../helper/email.helper");
const SmsHelper = require("../../helper/sms.helper");
const WappHelper = require("../../helper/wapp.helper");

const https = require("https");
const url = require("url");
const request = require("request");

exports.create = (req, res) => {

    const body = req.body;
    let errorsArray = [];
    let sms_status = 0;
    for (let index = 0; index < body.length; index++) {
        const element = body[index];
        const delivery_status = 0;
        let {
            policy_no,
            member_name,
            policy_status,
            gross_premium,
            mobile_number,
        } = element;

        IssuanceModel.findOne({
            where: { policy_no: policy_no },
        }).then((member) => {

            if (!member) {
                IssuanceModel.create({
                    policy_no,
                    member_name,
                    policy_status,
                    gross_premium,
                    mobile_number,
                    sms_status,
                    created_at: new Date(),
                    updated_at: new Date(),
                }).then((result) => {

                    if (index + 1 == body.length) {
                        if (!res.headersSent) {
                            return res.json({
                                status: 200,
                                message: "Find errors array in data node",
                                data: errorsArray,
                            });
                        }
                    }

                }).catch((error) => {

                })
            } else {
                if (index + 1 == body.length) {
                    if (!res.headersSent) {
                        return res.json({
                            status: 200,
                            message: "Find errors array in data node",
                            data: errorsArray,
                        });
                    }
                }
            }

        }).catch(error => {
            if (index + 1 == body.length) {
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
}

exports.create_old = (req, res) => {
    // Getting Base URL of
    var hostname = "http://" + req.headers.host.split(":")[0];
    hostname = hostname + "/pdms/backend";

    const body = req.body;
    let errorsArray = [];
    for (let index = 0; index < body.length; index++) {
        const element = body[index];
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

        DocumentModel.count({
            where: { policy_no: policy_no },
        }).then((count) => {
            if (count == 0) {
                errorsArray.push({
                    policy_no: element.policy_no,
                    message: "No policy document found for this member!",
                });

                if ((index + 1) == body.length) {
                    if (!res.headersSent) {
                        return res.json({
                            status: 200,
                            message: "Find errors array in data node",
                            data: errorsArray,
                        });
                    }
                }
            } else {
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
                                    if (member_email != "" && member_email != null) {
                                        EmailHelper.sendEmail(
                                            "./resources/email_templates/policydetails.template.html",
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
                                        const msg = `Dear ${member_name}, Your GHI ${policy_no} with premiun Rs. ${premium_amount} from Aditya Birla Health Insurance is now active till ${end_date}. Call 1800 270 7000 for help. Access Network Hospital list on https://www.adityabirlacapital.com/healthinsurance/locate-care/hospital-listing`;
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

                                    if (index + 1 == body.length) {
                                        if (!res.headersSent) {
                                            return res.json({
                                                status: 200,
                                                message: "Find errors array in data node",
                                                data: errorsArray,
                                            });
                                        }
                                    }
                                }).catch((error) => {
                                    errorsArray.push({
                                        policy_no: element.policy_no,
                                        message: error,
                                    });
                                    if (index + 1 == body.length) {
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
                                        if (member_email != "" && member_email != null) {
                                            EmailHelper.sendEmail(
                                                "./resources/email_templates/policydetails.template.html",
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
                                            const msg = `Dear ${member_name}, Your GHI ${policy_no} with premiun Rs. ${premium_amount} from Aditya Birla Health Insurance is now active till ${end_date}. Call 1800 270 7000 for help. Access Network Hospital list on https://www.adityabirlacapital.com/healthinsurance/locate-care/hospital-listing`;
                                            request(
                                                `http://182.75.84.114/admin/Sendwhatsapp/insert_whatsapp_api1?username=dineshmehta1508@gmail.com&password=12345678&mobile_no=${member_wapp_contact}&campaign_name=API&message=${msg}&uploaded1=http://pfm.contisofttechno.com/pdms/backend/${doc.document_path}`,
                                                function (error, response, body) {
                                                    console.log(body, error, response);
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

                                        if (index + 1 == body.length) {
                                            if (!res.headersSent) {
                                                return res.json({
                                                    status: 200,
                                                    message: "Find errors array in data node",
                                                    data: errorsArray,
                                                });
                                            }
                                        }
                                    }).catch((error) => {
                                        errorsArray.push({
                                            policy_no: element.policy_no,
                                            message: error,
                                        });
                                        if (index + 1 == body.length) {
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
                                    if (index + 1 == body.length) {
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
                                    if (member_email != "" && member_email != null) {
                                        EmailHelper.sendEmail(
                                            "./resources/email_templates/policydetails.template.html",
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
                                        const msg = `Dear ${member_name}, Your GHI ${policy_no} with premiun Rs. ${premium_amount} from Aditya Birla Health Insurance is now active till ${end_date}. Call 1800 270 7000 for help. Access Network Hospital list on https://www.adityabirlacapital.com/healthinsurance/locate-care/hospital-listing`;
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

                                    if (index + 1 == body.length) {
                                        if (!res.headersSent) {
                                            return res.json({
                                                status: 200,
                                                message: "Find errors array in data node",
                                                data: errorsArray,
                                            });
                                        }
                                    }
                                }).catch((error) => {
                                    errorsArray.push({
                                        policy_no: element.policy_no,
                                        message: error,
                                    });
                                    if (index + 1 == body.length) {
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
                                if (index + 1 == body.length) {
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
                            console.log();
                            errorsArray.push({
                                policy_no: element.policy_no,
                                message: error,
                            });
                            if (index + 1 == body.length) {
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
                    console.log(error);
                });
            }

        }).catch((error) => {
            console.log(error);
            if (!res.headersSent) {
                return res.json({
                    status: 400,
                    message: error,
                });
            }
        });
    }
};

exports.get_all = (req, res) => {
    MemberModel.hasOne(DeliveryStatus, { foreignKey: "member_id" });
    MemberModel.findAll({
        include: [
            {
                model: DeliveryStatus,
                attributes: ["sms_status", "wapp_status", "email_status"],
            },
        ],
    })
        .then((members) => {
            if (!res.headersSent) {
                return res.json({
                    status: 200,
                    message: "Members data is in data node.",
                    data: members,
                });
            }
        })
        .catch((error) => {
            console.log(error);
            if (!res.headersSent) {
                return res.json({
                    status: 400,
                    message: error,
                });
            }
        });
};

exports.sendEmail = (req, res) => {
    const response = EmailHelper.sendEmail(
        "./resources/email_templates/policydetails.template.html",
        "Pankaj",
        "pankaj@contisofttechno.com",
        "12377878",
        "http:localhost"
    );
    return res.json({
        status: 200,
        data: response,
    });
};

exports.sendSMS = async (req, res) => {

    const issuance_members = await IssuanceModel.findAll({ where: { sms_status: 0 }, limit: 1, raw: true }).then(deliveries => { return deliveries; }).catch(error => { console.log(error) });

    // var hostname = "http://" + req.headers.host.split(":")[0];
    // hostname = hostname + "/pdms/backend";

    let customUrl = "http://pdms.contisofttechno.com/pdms/backend/resources/pdf/GHI-TB-OL-21-IN5731889.PDF"
    for (let index = 0; index < issuance_members.length; index++) {
        const issuance_member = issuance_members[index];

        // const doc = await DocumentModel.findOne({ where: { policy_no: delivery.policy_no } }).then(doc => { return doc; }).catch(error => { error });

        if (issuance_member.mobile_number != '') {
            const msg = `Dear ${issuance_member.member_name} ! click ${customUrl} to download the tax certificate for Certificate of Insurance (COI) no.  ${issuance_member.policy_no} for cover under Aditya Birla Health Insurance plan DPMPRT`;
            // const mhg = "http://login.afrapro.in/api/mt/SendSMS?user=dineshmehta1508@gmail.com&password=12345678&senderid=DPMPRT&channel=Trans&DCS=0&flashsms=0&number=919096016308&text=${msg}&route=15&DLTTemplateId=1207163031484175403&PEID=1201159724306525673";
            request(
                `http://198.24.149.4/API/pushsms.aspx?loginID=DPMPrinters&password=Chea@1964&mobile=${issuance_member.mobile_number}&text=${msg}&senderid=DPMPRT&route_id=2&Unicode=0&Template_id=1207162980080624598`,
                function (error, response, body) {
                    console.log(body);
                    if (!error && response.statusCode === 200) {
                        IssuanceModel.update({
                            sms_status: 1,
                            sms_sid: JSON.parse(body).Transaction_ID
                        }, {
                            where: { policy_no: issuance_member.policy_no }
                        }).then(updated => {
                        }).catch(error => {
                            console.log(error);
                        });
                    } else {
                        IssuanceModel.update({
                            sms_status: 2,
                        }, {
                            where: { policy_no: issuance_member.policy_no }
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
        data: issuance_members
    });
}
exports.sendWApp = (req, res) => {
    const response = WappHelper.sendWApp();
    return res.json({
        status: 200,
        data: response,
    });
};
