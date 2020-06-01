// var paypal = require('paypal-rest-sdk');
var Paypal = require('paypal-adaptive');
var request = require('request');
var paypalSdk = new Paypal({
        userId:    'sb-50wae1943791_api1.business.example.com',
        password:  '2D5HW826YH9UYPAX',
        signature: 'A-9L5sjKRsouMIW.QKy2m.Euta.0AKGLM3JyPyLqgcbiCd1y3IJ9cO.k',
        sandbox:   true //defaults to false
});

class PaymentController {
     async index (req, res) {
        
        var amount = req.body.amount;
        var currency = req.body.currency;

        var body = JSON.stringify({
            actionType: "PAY",
            senderEmail: "sb-50wae1943791@business.example.com",
            receiverList: { receiver:
                [{
                email: "luke_1346604373_biz@onehappystudent.com",
                amount: "245"
                }]},
            currencyCode: currency,
            feesPayer: "EACHRECEIVER",
            memo: "This is a test",
            cancelUrl: "http://localhost:3333/cancel",
            returnUrl: "http://localhost:3333/process",
            ipnNotificationUrl: "http://your_ipn_notification_url",
            requestEnvelope: {
                errorLanguage: "en_US" 
            }
        })

        request.post({
            headers: { 
                "X-PAYPAL-SECURITY-USERID": "sb-50wae1943791_api1.business.example.com", 
                "X-PAYPAL-SECURITY-PASSWORD": "2D5HW826YH9UYPAX", 
                "X-PAYPAL-SECURITY-SIGNATURE": "A-9L5sjKRsouMIW.QKy2m.Euta.0AKGLM3JyPyLqgcbiCd1y3IJ9cO.k.", 
                "X-PAYPAL-REQUEST-DATA-FORMAT": "JSON", 
                "X-PAYPAL-RESPONSE-DATA-FORMAT": "JSON", 
                "X-PAYPAL-APPLICATION-ID": "APP-80W284485P519543T", 
                "Content-Type": "application/json"
            },
            url: 'https://svcs.sandbox.paypal.com/AdaptivePayments/Pay',
            body: body
            }, function(error, response, body) {
                var data = JSON.parse(body)
                var requestData = {
                    requestEnvelope: {
                        errorLanguage:  'en_US',
                        detailLevel:    'ReturnAll'
                    },
                    payKey: data.payKey
                };

                paypalSdk.callApi('AdaptivePayments/PaymentDetails', requestData, function (err, response) {
                    if (err) {
                        // You can see the error
                        res.json(err)
                    } else {
                        // Successful response
                        var payload = {
                            requestEnvelope: {
                                errorLanguage:  'en_US'
                            },
                            actionType:     'PAY',
                            currencyCode:   'USD',
                            feesPayer:      'EACHRECEIVER',
                            memo:           'Chained payment example',
                            cancelUrl:      'http://localhost:3333/cancel',
                            returnUrl:      'http://localhost:3333/process',
                            receiverList: {
                                receiver: [
                
                                    {
                                        email:  'sb-43l9ky1980270@personal.example.com',
                                        amount: amount*0.2,
                                        primary:'false'
                                    },
                                    {
                                        email:  'sb-50wae1943791@business.example.com',
                                        amount: amount*0.8,
                                        primary:'false'
                                    }
                                ]
                            }
                        };
                         
                        paypalSdk.pay(payload, function (err, response) {
                            if (err) {
                                console.log(err);
                            } else {
                                // Response will have the original Paypal API response
                                console.log(response);
                                // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily
                                console.log('Redirect to %s', response.paymentApprovalUrl);
                                res.json({ redirect_url: response.paymentApprovalUrl})
                            }
                        });
                    }
                });
        });
       
    }

    async process(req, res) {
        res.json('success')
    }
}

export default new PaymentController()