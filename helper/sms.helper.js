
const accountSid = 'AC8d2c93b1021fae9efb32e3b84473b076'; // Your Account SID from www.twilio.com/console
const authToken = 'b3b4d3c50d6d8a940dceadd4d571e6a0'; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);
const DeliveryModel = require('../models/delivery.model');

exports.sendSMS = (smsNumber, message, member_id) => {
    console.log(smsNumber);
    client.messages.create({
        body: message,
        messagingServiceSid: 'MG5024bc7ce25836444218b55c1b010f93',
        to: smsNumber
    }).then(message => {

        DeliveryModel.update({
            sms_status: 1,
        }, {
            where: { member_id: member_id }
        }).then(updated => {
            console.log(updated);
        }).catch(error => {
            console.log(error);
        });

        return message.sid;
    }).done();

}


