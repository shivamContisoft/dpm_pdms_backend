
const accountSid = 'AC8d2c93b1021fae9efb32e3b84473b076'; // Your Account SID from www.twilio.com/console
const authToken = 'b3b4d3c50d6d8a940dceadd4d571e6a0'; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);
const DeliveryModel = require('../models/delivery.model')

exports.sendWApp = (wappNumber, message, policy_no) => {
    // client.messages.create({
    //     body: message,
    //     to: 'whatsapp:+91' + wappNumber, // Text this number
    //     from: 'whatsapp:+14155238886', // From a valid Twilio number
    // }).then(message => {

    //     DeliveryModel.update({
    //         wapp_status: 1,
    //     }, {
    //         where: { member_id: member_id }
    //     }).then(updated => {
    //         console.log(updated);
    //     }).catch(error => {
    //         console.log(error);
    //     });

    //     return message.sid;
    // }).done();

    request(
        `https://182.75.84.114/admin/Sendwhatsapp/insert_whatsapp_api1?username=dineshmehta1508@gmail.com&password=12345678&mobile_no=${wappNumber}&campaign_name=API&message=${message}`,
        function (error, response, body) {
            console.log(body);
            if (!error && response.statusCode === 200) {
                if (response.statusCode === 200) {
                    DeliveryModel.update({
                        wapp_status: 1,
                    }, {
                        where: { policy_no: policy_no }
                    }).then(updated => {
                        console.log(JSON.parse(response.body));
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }
            console.log(response);
        }
    );


}


