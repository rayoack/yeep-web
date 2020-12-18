"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _JunoAccount = require('../models/JunoAccount'); var _JunoAccount2 = _interopRequireDefault(_JunoAccount);
var _Account = require('../models/Account'); var _Account2 = _interopRequireDefault(_Account);
var _BankAccount = require('../models/BankAccount'); var _BankAccount2 = _interopRequireDefault(_BankAccount);
var _services = require('../services');
var _Image = require('../models/Image'); var _Image2 = _interopRequireDefault(_Image);
var _qs = require('qs'); var _qs2 = _interopRequireDefault(_qs);
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _payments = require('../utils/payments');

class PaymentController {
  async getAccessToken({ req, res }) {
    // try {
        const token = await _services.PaymentServices.getAccessToken()

        let response = {
            token,
            environment: process.env.NODE_ENV
        }

        return res.json(response);
    // } catch (error) {
    //     return res.json(error);
    // }
  }

  async createDigitalAccount(req, res) {
    let junoAccessToken = await _services.PaymentServices.getAccessToken();

    let config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${junoAccessToken}`,
            'X-Api-Version': 2,
            'X-Resource-Token': process.env.JUNO_PRIVATE_TOKEN
        }
    }

    // try {
        const user = await _User2.default.findByPk(req.userId);

        const account = await _Account2.default.findByPk(req.body.accountId, {
            include: [
                {
                    model: _BankAccount2.default
                },
            ],
        })

        if(!account) return res.json({ error: 'Account not found' });

        let requestBody = {
            type: 'PAYMENT',
            name: account.legal_representative_name,
            document: account.cpf_cnpj,
            email: user.email,
            phone: account.phone_number,
            birthDate: account.date_of_birth,
            linesOfBusiness: account.line_of_business ? account.line_of_business : "Organização de eventos",
            address: {
                street: account.adress,
                number: account.adress_number,
                complement: account.complement ? account.complement : '',
                neighborhood: "",
                city: account.city,
                state: account.state,
                postCode: account.post_code,
            },
            businessArea: account.business_area ? account.business_area : '2016',
            bankAccount: {
                bankNumber: account.BankAccount.bank_number,
                agencyNumber: account.BankAccount.agency_number,
                accountNumber: account.BankAccount.account_number,
                accountComplementNumber: account.BankAccount.complement ? account.BankAccount.complement : '',
                accountType: account.BankAccount.account_type,
                accountHolder: {
                    name: account.BankAccount.account_holder_name,
                    document: account.BankAccount.account_holder_document
                }
            }
        }

        if(account.account_type === 'PJ') {
            requestBody.companyType = account.company_type;
            requestBody.tradingName = account.trading_name;
            requestBody.legalRepresentative = {
                name: account.legal_representative_name,
                document: account.legal_representative_document,
                birthDate: account.legal_representative_date_of_birth
            }
        }
    
        const response = await _axios2.default.post(`${_payments.junoUrlBase}/digital-accounts`, requestBody, config)
    
        if(response.data && response.data.resourceToken) {
            const digitalAccount = await _JunoAccount2.default.create({
                account_id: account.id,
                juno_id: response.data.id,
                resource_token: response.data.resourceToken,
                account_type: response.data.type,
                account_status: response.data.status
            });

            let configNotification = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${junoAccessToken}`,
                    'X-Api-Version': 2,
                    'X-Resource-Token': digitalAccount.resource_token
                }
            }
            
            console.log('NOTIFICATIONS CONFIG!!!!', configNotification)
            
            const webhookForm = {
                url: `${process.env.APP_URL}/info`,
                eventTypes: [
                    "DOCUMENT_STATUS_CHANGED", "DIGITAL_ACCOUNT_STATUS_CHANGED", "TRANSFER_STATUS_CHANGED", "PAYMENT_NOTIFICATION", "CHARGE_STATUS_CHANGED"
                ]
            }

            console.log('NOTIFICATIONS webhookForm!!!!', webhookForm)
            const notificationResponse = await _axios2.default.post(`${_payments.junoUrlBase}/notifications/webhooks`, webhookForm, configNotification)
    
            console.log({notificationResponse})
            return res.json(digitalAccount);
        } else {
            return res.json(response);
        }
        
    // } catch (error) {
    //     res.json(error);
    // }


  }

  async checkBalance(req, res) {
    let junoAccessToken =  await _services.PaymentServices.getAccessToken();

    if(!junoAccessToken) return res.json({ error: 'Access token é obrigatório' });

    // try {
        const account = await _Account2.default.findOne({
            where: {
                user_id: req.userId,
                default: true
            }
        })

        if(!account) return res.status(404).json({ 
            error: 'Não foi encontrada nenhuma conta para esse usuário',
            type: 'accountNotFound'
         });

        const junoAccount = await _JunoAccount2.default.findOne({
            where: { account_id: account.id }
        });

        if(!junoAccount) return res.status(404).json({ 
            error: 'Não foi encontrada uma conta digital para esse usuário',
            type: 'digitalAccountNotFound'
        });

        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${junoAccessToken}`,
                'X-Api-Version': 2,
                'X-Resource-Token': junoAccount.resource_token
            }
        }

        const response = await _axios2.default.get(`${_payments.junoUrlBase}/balance`, config)

        res.json(response.data);
    // } catch (error) {
    //     res.json(error);
    // }

  }

  async checkDocuments(req, res) {
    let junoAccessToken =  await _services.PaymentServices.getAccessToken();

    if(!junoAccessToken) return res.json({ error: 'Access token é obrigatório' });

    const junoAccount = await _JunoAccount2.default.findOne({
        where: { id: req.params.id }
    });

    if(!junoAccount) return res.json({ 
        error: 'Não foi encontrada a conta digital do usuário',
        type: 'Digital account not found'
    });

    let config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${junoAccessToken}`,
            'X-Api-Version': 2,
            'X-Resource-Token': junoAccount.resource_token
        }
    }

    const response = await _axios2.default.get(`${_payments.junoUrlBase}/documents`, config)

    res.json(response.data._embedded.documents);
  }

    async info(req, res) {
        switch (req.body.eventType) {
            case 'DIGITAL_ACCOUNT_STATUS_CHANGED':
                _services.PaymentServices.updateAccountStatus(req.body.data[0], req);
                break;
        
            default:
                break;
        }

        res.json(req.body)
    }
}

exports. default = new PaymentController();

// const axios = require ('axios');
// const mercadopago = require ('mercadopago');
// const meli = require('mercadolibre');
// // export { V2 } from 'juno-node-sdk';
// import { JunoSDK, JunoEnvironments } from 'juno-node-sdk';

// import User from '../models/User';
// import ReceiverAccount from '../models/ReceiverAccount';

// class PaymentController {

//   async store (req, res) {

//     const getFullUrl = (req) =>{
//       const url = req.protocol + '://' + req.get('host');
//       console.log(url)
//       return url;
//     }

//     mercadopago.configure({
//         sandbox: process.env.MP_SANDBOX == 'true' ? true : false,
//         access_token: process.env.MP_ACCESS_TOKEN
//     });

//     const { id, paymentType, payerEmail, title, description, currency, amount } = req.body;

//     //Create purchase item object template
//     let purchaseOrder = {
//       items: [
//         {
//           id,
//           title,
//           description,
//           quantity: 1,
//           currency_id: currency,
//           unit_price: parseFloat(amount)
//         }
//       ],
//       payer : {
//         email: payerEmail
//       },
//       marketplace_fee: 10,
//       auto_return : "all",
//       external_reference : id,
//       back_urls : {
//         success : getFullUrl(req) + "/payments/success",
//         pending : getFullUrl(req) + "/payments/pending",
//         failure : getFullUrl(req) + "/payments/failure",
//       }
//     }

//     //Generate init_point to checkout
//     try {
//       const preference = await mercadopago.preferences.create(purchaseOrder);
//       return res.redirect(`${preference.body.init_point}`);
//     }catch(err){
//       return res.send(err.message);
//     }

//   }

//   async process(req, res) {
//     const { code } = req.query;

//     res.json(code)
//   }

//   async updateUserToken(req, res) {
//     const { code, updateMp } = req.body;

//     if(updateMp) {

//       const accounts = await ReceiverAccount.findAll({
//         where: { user_id: req.userId }
//       })

//       var meliObject = new meli.Meli(
//         process.env.MP_CLIENT_ID,
//         process.env.MP_CLIENT_SECRET_KEY,
//       );

//       meliObject.authorize(
//         code,
//         'https://yeep-web.herokuapp.com/process',
//         function(error, response){

//           if(error) {
//             res.json(error)

//           } else {

//             let accountObj = {
//               user_id: req.userId,
//               receiver_access_token: response.access_token,
//               receiver_refresh_token: response.refresh_token,
//               receiver_user_id: response.user_id,
//               receiver_token_date: new Date()
//             }

//             meliObject.get('users', {
//                 ids: [response.user_id]
//             }, async function (err, users) {

//               if(error) {
//                 res.json(error)

//               } else {
//                 accountObj.receiver_email = users[0].body.email

//                 if(accounts.length) {
//                   const actualAccount = accounts[0]
//                   console.log('actualAccount', actualAccount)

//                   await actualAccount.update(accountObj)

//                   res.json(actualAccount)

//                 } else {

//                   const account = await ReceiverAccount.create(accountObj)

//                   res.json(account)
//                 }
//               }
//             })
//           }
//         }
//       )
//     }
//   }

//   async success(req, res) {
//     res.json('success')
//   }

//   async info(req, res) {
//     res.json('success')
//   }

//   async pending(req, res) {
//     res.json('success')
//   }

//   async failure(req, res) {
//     res.json('success')
//   }

//   async test(req, res) {

//     const juno = new JunoSDK({
//       token: process.env.JUNO_PRIVATE_TOKEN,
//       clientId: process.env.JUNO_CLIENT_ID,
//       secret: process.env.JUNO_SECRET,
//       environment: "sandbox"
//     })

//     res.json(juno._digitalAccount.junoClient.post)
//   }

// }

// export default new PaymentController()

