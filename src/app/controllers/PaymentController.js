import User from '../models/User';
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
        
        return res.json(response.data);
      } catch (error) {
        return res.json(error);
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

