const Op = require('sequelize').Op
const DocumentModel = require('../../models/document.model');
const MemberModel = require('../../models/member.model');
const DeliveryModel = require('../../models/delivery.model');

exports.getAllTransactions = (req, res) => {

    DeliveryModel.belongsTo(MemberModel, { foreignKey: 'member_id' });
    DeliveryModel.findAll({
        include: [{ model: MemberModel, attributes: ['member_name', 'member_email', 'member_sms_contact', 'member_wapp_contact'] }],
    }).then(transactions => {

        if (!res.headersSent) {
            return res.json({
                status: 200,
                data: transactions
            });
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 401,
                message: error
            })
        }
    });

}


exports.getEmailTransactions = (req, res) => {

    const status = req.query.status;
    let whereClause = [];
    if (req.query.status) {
        whereClause.push({ email_status: status });
    }

    DeliveryModel.belongsTo(MemberModel, { foreignKey: 'member_id' });
    DeliveryModel.findAll({
        include: [{ model: MemberModel, attributes: ['member_name', 'member_email', 'member_sms_contact', 'member_wapp_contact'] }],
        where: whereClause
    }).then(transactions => {

        if (!res.headersSent) {
            return res.json({
                status: 200,
                data: transactions
            });
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 401,
                message: error
            })
        }
    });

}

exports.getSmsTransactions = (req, res) => {

    const status = req.query.status;
    let whereClause = [];
    if (req.query.status) {
        whereClause.push({ sms_status: status });
    }


    DeliveryModel.belongsTo(MemberModel, { foreignKey: 'member_id' });
    DeliveryModel.findAll({
        include: [{ model: MemberModel, attributes: ['member_name', 'member_email', 'member_sms_contact', 'member_wapp_contact'] }],
        where: whereClause
    }).then(transactions => {

        if (!res.headersSent) {
            return res.json({
                status: 200,
                data: transactions
            });
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 401,
                message: error
            })
        }
    });

}

exports.getWappTransactions = (req, res) => {

    const status = req.query.status;
    let whereClause = [];
    if (req.query.status) {
        whereClause.push({ wapp_status: status });
    }


    DeliveryModel.belongsTo(MemberModel, { foreignKey: 'member_id' });
    DeliveryModel.findAll({
        include: [{ model: MemberModel, attributes: ['member_name', 'member_email', 'member_sms_contact', 'member_wapp_contact'] }],
        where: whereClause
    }).then(transactions => {

        if (!res.headersSent) {
            return res.json({
                status: 200,
                data: transactions
            });
        }

    }).catch(error => {
        console.log(error);
        if (!res.headersSent) {
            return res.json({
                status: 401,
                message: error
            })
        }
    });

}

exports.updateDeliveries = (req, res) => {

    MemberModel.findAll().then(members => {

        for (let index = 0; index < members.length; index++) {
            const element = members[index];

            DeliveryModel.update({
                policy_no: element.policy_no,
            }, {
                where: { member_id: element.id },
            }).then(updated => {

                if ((index + 1) === members.length) {
                    return res.json({
                        status: 200,
                        count: members.length,
                    });
                }

            }).catch(error => {
                console.log(error);
            });

        }

    }).catch(error => {
        console.log(error);
    });

}