const Sequelize = require('sequelize');
const db = require('../config/database');

const Member = db.define('pdms_members_dumps', {
    policy_no: {
        type: Sequelize.STRING
    },
    member_name: {
        type: Sequelize.STRING
    },
    member_email: {
        type: Sequelize.STRING
    },
    member_sms_contact: {
        type: Sequelize.STRING
    },
    member_wapp_contact: {
        type: Sequelize.STRING
    },
    member_address: {
        type: Sequelize.STRING
    },
    member_city: {
        type: Sequelize.STRING
    },
    start_date: {
        type: Sequelize.STRING
    },
    end_date: {
        type: Sequelize.STRING
    },
    premium_amount: {
        type: Sequelize.STRING
    },
    delivery_status: {
        type: Sequelize.INTEGER
    },
    created_at: {
        type: 'TIMESTAMP'
    },
    updated_at: {
        type: 'TIMESTAMP'
    }
})

module.exports = Member;