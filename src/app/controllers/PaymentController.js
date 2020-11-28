import User from '../models/User';
import JunoAccount from '../models/JunoAccount';
import Image from '../models/Image';
import qs from 'qs';
import axios from 'axios';
import { junoUrlBase } from '../utils/payments'

class PaymentController {
  async getAccessToken({ req, res }) {
    try {

        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${process.env.JUNO_BASIC_AUTHORIZATION}`
            }
        }

        const requestBody = {
            grant_type: 'client_credentials'
        };

        const response = await axios.post(`${junoUrlBase}/authorization-server/oauth/token`, qs.stringify(requestBody), config)

        return response.data;
    } catch (error) {
        return res.json(error);
    }
  }

  async createDigitalAccount(req, res) {
    let body = req.body;
    let junoAccessToken = body.access_token;
    delete body.access_token; 

    let config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${junoAccessToken}`,
            'X-Api-Version': 2,
            'X-Resource-Token': process.env.JUNO_PRIVATE_TOKEN
        }
    }

    try {
        const user = await User.findByPk(req.userId);
    
        const requestBody = {
            // Dados do front req.body
                        // bankAccount: {
            //     bankNumber: "033",
            //     agencyNumber: "3333",
            //     accountNumber: "010731000",
            //     accountComplementNumber: "",
            //     accountType: "CHECKING",
            //     accountHolder: {
            //       name: "Test PF",
            //       document: "01234567890"
            //     }
            // }

            // SE PJ adicionar
            // "businessArea": "2016", (SE PF SETAR 2016)
            // "companyType": "MEI",
            // "tradingName": "Yeep",
            // "businessUrl": "https://www.yeep-web.com",  (SE PF SETAR URL DA YEEP)
            // "legalRepresentative": {
            //     "name": "Joel Barbosa Junior",
            //     "document": "06210416705",
            //     "birthDate": "1994-08-23"
            // },
            // ---------####----------

            // Se o tipo for payment/organizer passa o line of business e é removido o businessUrl
            // "linesOfBusiness": "Organização de eventos",
            // ---------####----------
            
            type: user.role != 'organizer' ? 'RECEIVING' : 'PAYMENT',
            name: user.name,
            document: user.cpf_cnpj,
            email: user.email,
            phone: user.phone_number,
            birthDate: user.date_of_birth,
            autoApprove: true,
            address: {
                street: user.adress,
                number: user.adress_number,
                complement: "",
                neighborhood: "",
                city: user.city,
                state: user.state,
                postCode: user.post_code
            },
            ...body,
        };
    
        const response = await axios.post(`${junoUrlBase}/api-integration/digital-accounts`, requestBody, config)
    
        const digitalAccount = await JunoAccount.create({
            user_id: user.id,
            juno_id: response.data.id,
            resource_token: response.data.resourceToken,
            account_type: response.data.type,
            account_status: response.data.status
        });

        return res.json(digitalAccount);
        
    } catch (error) {
        res.json(error);
    }


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

