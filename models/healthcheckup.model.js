const Sequelize = require('sequelize');
const db = require('../config/database');

const healthCheckup_sms = db.define('pdms_heath_checkups_sms_deliveries', {
    policy_no: {
        type: Sequelize.STRING,
    },
    member_name: { type: Sequelize.STRING },
    mobile_number: { type: Sequelize.STRING },
    sms_status: {
        type: Sequelize.INTEGER,
    },
    sms_sid: { type: Sequelize.STRING },
    created_at: {
        type: 'TIMESTAMP'
    },
})

module.exports = healthCheckup_sms;