const Sequelize = require('sequelize');
const db = require('../config/database');

const sms_Delivery = db.define('pdms_sms_deliveries', {
    policy_no: {
        type: Sequelize.STRING,
    },
    member_name: { type: Sequelize.STRING },
    policy_status: { type: Sequelize.STRING },
    gross_premium: { type: Sequelize.STRING },
    mobile_number: { type: Sequelize.STRING },
    sms_status: {
        type: Sequelize.INTEGER,
    },
    sms_sid: { type: Sequelize.STRING },
    created_at: {
        type: 'TIMESTAMP'
    },
})

module.exports = sms_Delivery;