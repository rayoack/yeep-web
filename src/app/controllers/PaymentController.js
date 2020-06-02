// var paypal = require('paypal-rest-sdk');
// var Paypal = require('paypal-adaptive');
// var request = require('request');
// var paypalSdk = new Paypal({
//         userId:    `${process.env.PAYPAL_USER}`,
//         password:  `${process.env.PAYPAL_USER_PASSWORD}`,
//         signature: `${process.env.PAYPAL_USER_SIGNATURE}`,
//         appId: "Aa6QtPVWZApIKK1im-hiNM-3WZOuHNXGFg8VNN2YvoPmPF003QlSC3hc-YOGkXzeIH14g4Ij0cy_O9DJ",
//         sandbox:   false //defaults to false
// });

class PaymentController {
     async index (req, res) {
        res.json('success')

        // var amount = req.body.amount;
        // var currency = req.body.currency;
        // var receiver_list = req.body.receiver_list;
        // var body = JSON.stringify({
        //     actionType: "PAY",
        //     senderEmail: "sb-2py1u1948028@business.example.com",
        //     receiverList: { receiver: receiver_list },
        //     currencyCode: currency,
        //     feesPayer: "EACHRECEIVER",
        //     memo: "This is a test",
        //     cancelUrl: "http://localhost:3333/cancel",
        //     returnUrl: "http://localhost:3333/process",
        //     ipnNotificationUrl: "http://your_ipn_notification_url",
        //     requestEnvelope: {
        //         errorLanguage: "en_US"
        //     }
        // })


        // request.post({
        //     headers: {
        //         "X-PAYPAL-SECURITY-USERID": `${process.env.PAYPAL_USER}`,
        //         "X-PAYPAL-SECURITY-PASSWORD": `${process.env.PAYPAL_USER_PASSWORD}`,
        //         "X-PAYPAL-SECURITY-SIGNATURE": `${process.env.PAYPAL_USER_SIGNATURE}`,
        //         "X-PAYPAL-REQUEST-DATA-FORMAT": "JSON",
        //         "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON",
        //         "X-PAYPAL-APPLICATION-ID": "Aa6QtPVWZApIKK1im-hiNM-3WZOuHNXGFg8VNN2YvoPmPF003QlSC3hc-YOGkXzeIH14g4Ij0cy_O9DJ",
        //         "Content-Type": "application/json"
        //     },
        //     url: 'https://svcs.sandbox.paypal.com/AdaptivePayments/Pay',
        //     body: body
        //     }, function(error, response, body) {
        //         var data = JSON.parse(body)
        //         var requestData = {
        //             requestEnvelope: {
        //                 errorLanguage:  'en_US',
        //                 detailLevel:    'ReturnAll'
        //             },
        //             payKey: data.payKey
        //         };
        //         console.log(data)

        //         paypalSdk.callApi('AdaptivePayments/PaymentDetails', requestData, function (err, response) {
        //             if (err) {
        //                 // You can see the error
        //                 res.json(err)
        //             } else {
        //                 // Successful response
        //                 var payload = {
        //                     requestEnvelope: {
        //                         errorLanguage:  'en_US'
        //                     },
        //                     actionType:     'PAY',
        //                     currencyCode:   'USD',
        //                     feesPayer:      'EACHRECEIVER',
        //                     memo:           'Chained payment example',
        //                     cancelUrl:      'http://localhost:3333/cancel',
        //                     returnUrl:      'http://localhost:3333/process',
        //                     receiverList: {
        //                         receiver: [

        //                             ...receiver_list,
        //                             {
        //                                 email:  process.env.PAYPAL_USER_EMAIL,
        //                                 amount: amount*0.1,
        //                                 primary:'false'
        //                             }
        //                         ]
        //                     }
        //                 };

        //                 paypalSdk.pay(payload, function (err, response) {
        //                     if (err) {
        //                         console.log(err);
        //                     } else {
        //                         // Response will have the original Paypal API response
        //                         console.log(response);
        //                         // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily
        //                         console.log('Redirect to %s', response.paymentApprovalUrl);
        //                         res.json({ redirect_url: response.paymentApprovalUrl})
        //                     }
        //                 });
        //             }
        //         });
        // });

    }

    async process(req, res) {
        res.json('success')
    }
}

export default new PaymentController()

