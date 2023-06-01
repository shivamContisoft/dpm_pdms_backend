const Sequelize = require('sequelize');

const USERNAME = "root";
const PASSWORD = "root@123";
const DATABASE = "pdms_db";
const HOST = "localhost";

// const USERNAME = "contisoft";
// const PASSWORD = "Contisoft@2021";
// const DATABASE = "pdms_db";
// const HOST = "10.21.2.94";

module.exports = new Sequelize(DATABASE, USERNAME, PASSWORD, {
    host: HOST,
    port: 3306,
    dialect: 'mysql',
    logging: console.log,
    define: {
        timestamps: false
    },
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    keys: {
        secret: 'changethis', // Should not be made public
    }
});