const Sequelize = require('sequelize');
const db = require('../config/database');

const old_Document = db.define('old_pdms_documents', {
    policy_no: {
        type: Sequelize.STRING
    },
    document_name: {
        type: Sequelize.STRING
    },
    document_path: {
        type: Sequelize.STRING
    },
    document_directory: {
        type: Sequelize.STRING
    },
    document_size: {
        type: Sequelize.STRING
    },
    document_type: {
        type: Sequelize.STRING
    },
    created_at: {
        type: 'TIMESTAMP'
    },
})

module.exports = old_Document;