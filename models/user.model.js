const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('pdms_users', {
    first_name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    designation: {
        type: Sequelize.STRING
    },
    email_id: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    contact: {
        type: Sequelize.STRING
    },
    created_at: {
        type: 'TIMESTAMP'
    },
    updated_at: {
        type: 'TIMESTAMP'
    }
})

module.exports = User;