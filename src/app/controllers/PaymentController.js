import User from '../models/User';
import JunoAccount from '../models/JunoAccount';
import Account from '../models/Account';
import BankAccount from '../models/BankAccount';
import { PaymentServices } from '../services'
import Image from '../models/Image';
import qs from 'qs';
import axios from 'axios';
import { junoUrlBase } from '../utils/payments'

class PaymentController {
  async getAccessToken({ req, res }) {
    // try {
        const token = await PaymentServices.getAccessToken()
        
        console.log({token})
        return res.json(token);
    // } catch (error) {
    //     return res.json(error);
    // }
  }

  async createDigitalAccount(req, res) {
    let junoAccessToken = await PaymentServices.getAccessToken();

    let config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${junoAccessToken}`,
            'X-Api-Version': 2,
            'X-Resource-Token': process.env.JUNO_PRIVATE_TOKEN
        }
    }

    // try {
        const user = await User.findByPk(req.userId);

        const account = await Account.findAll({
            where: {
                user_id: req.userId,
                default: true
            },
            limit: 1,
            include: [
                {
                    model: BankAccount
                },
            ],
        })

        let requestBody = {
            type: 'PAYMENT',
            name: account[0].legal_representative_name,
            document: account[0].cpf_cnpj,
            email: user.email,
            phone: account[0].phone_number,
            birthDate: account[0].date_of_birth,
            linesOfBusiness: account[0].line_of_business ? account[0].line_of_business : "Organização de eventos",
            address: {
                street: account[0].adress,
                number: account[0].adress_number,
                complement: account[0].complement ? account[0].complement : '',
                neighborhood: "",
                city: account[0].city,
                state: account[0].state,
                postCode: account[0].post_code
            },
            businessArea: account[0].business_area ? account[0].business_area : '2016',
            bankAccount: {
                bankNumber: account[0].BankAccount.bank_number,
                agencyNumber: account[0].BankAccount.agency_number,
                accountNumber: account[0].BankAccount.account_number,
                accountComplementNumber: account[0].BankAccount.complement ? account[0].BankAccount.complement : '',
                accountType: account[0].BankAccount.account_type,
                accountHolder: {
                    name: account[0].BankAccount.account_holder_name,
                    document: account[0].BankAccount.account_holder_document
                }
            }
        }

        if(account[0].account_type === 'PJ') {
            requestBody.companyType = account[0].company_type;
            requestBody.tradingName = account[0].trading_name;
            requestBody.legalRepresentative = {
                name: account[0].legal_representative_name,
                document: account[0].legal_representative_document,
                birthDate: account[0].legal_representative_date_of_birth
            }
        }
    
        const response = await axios.post(`${junoUrlBase}/api-integration/digital-accounts`, requestBody, config)
    
        const digitalAccount = await JunoAccount.create({
            account_id: account[0].id,
            juno_id: response.data.id,
            resource_token: response.data.resourceToken,
            account_type: response.data.type,
            account_status: response.data.status
        });

        return res.json(digitalAccount);
        
    // } catch (error) {
    //     res.json(error);
    // }


  }

  async checkBalance(req, res) {
    let junoAccessToken =  await PaymentServices.getAccessToken();

    if(!junoAccessToken) return res.json({ error: 'Access token é obrigatório' });

    // try {
        const account = await Account.findOne({
            where: {
                user_id: req.userId,
                default: true
            }
        })

        if(!account) return res.json({ 
            error: 'Não foi encontrada nenhuma conta esse usuário',
            type: 'Account not found'
         });

        const junoAccount = await JunoAccount.findOne({
            where: { account_id: account.id }
        });

        if(!junoAccount) return res.json({ 
            error: 'Não foi encontrada uma conta digital para esse usuário',
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

        const response = await axios.get(`${junoUrlBase}/api-integration/balance`, config)

        res.json(response.data);
    // } catch (error) {
    //     res.json(error);
    // }

  }

    async info(req, res) {
        console.log('okkkkkkkkkk');
        console.log('REQ BODY', req.body);
        res.json(req.body)
    }
}

export default new PaymentController();

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

