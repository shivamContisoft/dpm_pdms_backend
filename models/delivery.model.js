const Sequelize = require('sequelize');
const db = require('../config/database');

const Delivery = db.define('pdms_deliveries', {
    member_id: {
        type: Sequelize.INTEGER,
    },
    policy_no: {
        type: Sequelize.STRING,
    },
    sms_status: {
        type: Sequelize.INTEGER,
    },
    wapp_status: {
        type: Sequelize.INTEGER,
    },
    email_status: {
        type: Sequelize.INTEGER,
    },
    sms_sid: {
        type: Sequelize.INTEGER,
    },
    wapp_sid: {
        type: Sequelize.INTEGER,
    },
    created_at: {
        type: 'TIMESTAMP'
    },
})

module.exports = Delivery;