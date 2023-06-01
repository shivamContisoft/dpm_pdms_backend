const DocumentModel = require('../../models/document.model');
const MemberModel = require('../../models/member.model');
const DeliveryModel = require('../../models/delivery.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var moment = require('moment');
exports.get = (req, res) => {

    let data = { totalDocuments: 0, totalMembers: 0, totalTransactions: 0, deliveredEmails: 0, bouncedEmails: 0, deliveredSms: 0, bouncedSms: 0, deliveredWapp: 0, bouncedWapp: 0, };

    const promis1 = new Promise((resolve, reject) => {
        const totalDocPromis = DocumentModel.count().then(count =>{ data.totalDocuments =  count; });
        resolve(totalDocPromis);
    });

    const promis2 = new Promise((resolve, reject) => {
        const totalMemPromis = MemberModel.count().then(count =>{ data.totalMembers =  count; });
        resolve(totalMemPromis);
    });

    const promis3 = new Promise((resolve, reject) => {
        const totalTransactionsPromis = DeliveryModel.count().then(count =>{ data.totalTransactions =  count * 3; });
        resolve(totalTransactionsPromis);
    });

    const promis4 = new Promise((resolve, reject) => {
        const deliveredEmailsPromis = DeliveryModel.count({ where: { email_status: 1 }}).then(count =>{ data.deliveredEmails =  count; });
        resolve(deliveredEmailsPromis);
    });

    const promis5 = new Promise((resolve, reject) => {
        const bouncedEmailsPromis = DeliveryModel.count({ where: { email_status: 0 } }).then(count =>{ data.bouncedEmails =  count; });
        resolve(bouncedEmailsPromis);
    });

    const promis6 = new Promise((resolve, reject) => {
        const deliveredSmsPromis = DeliveryModel.count({ where: { sms_status: 1 } }).then(count =>{ data.deliveredSms =  count; });
        resolve(deliveredSmsPromis);
    });

    const promis7 = new Promise((resolve, reject) => {
        const bouncedSmsPromis = DeliveryModel.count({ where: { sms_status: 0 } }).then(count =>{ data.bouncedSms =  count; });
        resolve(bouncedSmsPromis);
    });

    const promis8 = new Promise((resolve, reject) => {
        const deliveredWappPromis = DeliveryModel.count({ where: { wapp_status: 1 }  }).then(count =>{ data.deliveredWapp =  count; });
        resolve(deliveredWappPromis);
    });

    const promis9 = new Promise((resolve, reject) => {
        const totalDocCount = DeliveryModel.count({  where: { wapp_status: 0 }}).then(count =>{ data.bouncedWapp =  count; });
        resolve(totalDocCount);
    });

    Promise.all([promis1, promis2, promis3, promis4, promis5, promis6, promis7, promis8, promis9]).then((values) => {
        res.json({
            status: 200,
            message: "Supplier created successfuly!",
            data: data
        });
    });
    // DocumentModel.count().then(count => {

    // }).then(next => {

    //     MemberModel.count().then(count => {
    //         data.totalMembers = count;
    //         return true;
    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).then(() => {
    //     DeliveryModel.count().then(count => {
    //         data.totalTransactions = count * 3;
    //         return true;
    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).then(() => {
    //     DeliveryModel.count({ where: { email_status: 1 } }).then(count => {
    //         data.deliveredEmails = count;
    //         return true;
    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).then(() => {
    //     DeliveryModel.count({ where: { email_status: 0 } }).then(count => {
    //         data.bouncedEmails = count;
    //         return true;
    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).then(() => {
    //     DeliveryModel.count({ where: { sms_status: 1 } }).then(count => {
    //         data.deliveredSms = count;
    //         return true;
    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).then(() => {
    //     DeliveryModel.count({ where: { sms_status: 0 } }).then(count => {
    //         data.bouncedSms = count;
    //         return true;
    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).then(() => {
    //     DeliveryModel.count({ where: { wapp_status: 1 } }).then(count => {
    //         data.deliveredWapp = count;
    //         return true;
    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).then(() => {
    //     DeliveryModel.count({ where: { wapp_status: 0 } }).then(count => {
    //         data.bouncedWapp = count;

    //         return res.json({
    //             status: 200,
    //             data: data
    //         });

    //     }).catch(error => {
    //         console.log(error);
    //         if (!res.headersSent) {
    //             return res.json({
    //                 status: 401,
    //                 message: error
    //             })
    //         }
    //     });
    // }).catch(error => {
    //     console.log(error);
    //     if (!res.headersSent) {
    //         return res.json({
    //             status: 401,
    //             message: error
    //         })
    //     }
    // });

}

exports.getTodaysDetails = (req, res) => {
    const TODAY_START = moment().format('YYYY-MM-DD 00:00:01');
    const NOW = moment().format('YYYY-MM-DD 23:59:59');
    const options = { where:{ created_at: 
        { 
          [Op.gt]: TODAY_START,
          [Op.lte]: NOW 
        } 
    }};
    let TodaysPolicydata = { totalDocuments: 0, totalMembers: 0, totalTransactions: 0, deliveredEmails: 0, bouncedEmails: 0, deliveredSms: 0, bouncedSms: 0, deliveredWapp: 0, bouncedWapp: 0, };

    const promis1 = new Promise((resolve, reject) => {
        const totalDocPromis = DocumentModel.count(options).then(count =>{ TodaysPolicydata.totalDocuments =  count; });
        resolve(totalDocPromis);
    });

    const promis2 = new Promise((resolve, reject) => {
        const totalMemPromis = MemberModel.count(options).then(count =>{ TodaysPolicydata.totalMembers =  count; });
        resolve(totalMemPromis);
    });

    const promis3 = new Promise((resolve, reject) => {
        const totalTransactionsPromis = DeliveryModel.count(options).then(count =>{ TodaysPolicydata.totalTransactions =  count * 3; });
        resolve(totalTransactionsPromis);
    });

    const promis4 = new Promise((resolve, reject) => {
        const deliveredEmailsPromis = DeliveryModel.count({ where: { email_status: 1 , created_at: 
            { 
              [Op.gt]: TODAY_START,
              [Op.lte]: NOW 
            },
        }}).then(count =>{ TodaysPolicydata.deliveredEmails =  count; });
        resolve(deliveredEmailsPromis);
    });

    const promis5 = new Promise((resolve, reject) => {
        const bouncedEmailsPromis = DeliveryModel.count({ where: { email_status: 0 , created_at: 
            { 
              [Op.gt]: TODAY_START,
              [Op.lte]: NOW 
            }} }).then(count =>{ TodaysPolicydata.bouncedEmails =  count; });
        resolve(bouncedEmailsPromis);
    });

    const promis6 = new Promise((resolve, reject) => {
        const deliveredSmsPromis = DeliveryModel.count({ where: { sms_status: 1,created_at: 
            { 
              [Op.gt]: TODAY_START,
              [Op.lte]: NOW 
            } } }).then(count =>{ TodaysPolicydata.deliveredSms =  count; });
        resolve(deliveredSmsPromis);
    });

    const promis7 = new Promise((resolve, reject) => {
        const bouncedSmsPromis = DeliveryModel.count({ where: { sms_status: 0, created_at: 
            { 
              [Op.gt]: TODAY_START,
              [Op.lte]: NOW 
            }, } }).then(count =>{ TodaysPolicydata.bouncedSms =  count; });
        resolve(bouncedSmsPromis);
    });

    const promis8 = new Promise((resolve, reject) => {
        const deliveredWappPromis = DeliveryModel.count({ where: { wapp_status: 1, created_at: 
            { 
              [Op.gt]: TODAY_START,
              [Op.lte]: NOW 
            } }  }).then(count =>{ TodaysPolicydata.deliveredWapp =  count; });
        resolve(deliveredWappPromis);
    });

    const promis9 = new Promise((resolve, reject) => {
        const totalDocCount = DeliveryModel.count({  where: { wapp_status: 0 , created_at: 
            { 
              [Op.gt]: TODAY_START,
              [Op.lte]: NOW 
            }}}).then(count =>{ TodaysPolicydata.bouncedWapp =  count; });
        resolve(totalDocCount);
    });

    Promise.all([promis1, promis2, promis3, promis4, promis5, promis6, promis7, promis8, promis9]).then((values) => {
        res.json({
            status: 200,
            message: "Supplier created successfully!",
            data: TodaysPolicydata
        });
    });
}