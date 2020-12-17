import User from '../models/User';
import { Op } from "sequelize";
import isPast from 'date-fns/isPast'
import addMinutes from 'date-fns/addMinutes'
import addHours from 'date-fns/addHours'
import JunoAccount from '../models/JunoAccount';
import Account from '../models/Account';
import JunoToken from '../models/JunoToken';
import Notification from '../models/Notification';
import Account from '../models/Account';
import BankAccount from '../models/BankAccount';
import qs from 'qs';
import axios from 'axios';
import { junoUrlBaseAuthorization } from '../utils/payments'

class PaymentServices {
    async getAccessToken() {
        const junoToken = await JunoToken.findAll({
          where: {
            access_token: {
                [Op.not]: null
            }
          },
        })

        if(!junoToken[0]) {
            const newAccessToken = await this.getAccessTokenFromJunoApi();

            const tokenDataCreated = await JunoToken.create({
                access_token: newAccessToken.access_token,
            });

            return tokenDataCreated.access_token;
        } else {
            const isTokenExpired = await this.tokenIsExpired(junoToken[0]);

            if(isTokenExpired || !junoToken[0].access_token) {
                const newAccessToken = await this.getAccessTokenFromJunoApi();

                const tokenDataUpdated = await JunoToken.update({
                    access_token: newAccessToken.access_token,
                }, {
                    where: {
                      id: junoToken[0].id
                    }
                });

                return tokenDataUpdated.access_token
            }

            return junoToken[0].access_token

        }

    }

    async getAccessTokenFromJunoApi() {

        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${process.env.JUNO_BASIC_AUTHORIZATION}`
            }

        }

        const requestBody = {
            grant_type: 'client_credentials'
        };

        const response = await axios.post(`${junoUrlBaseAuthorization}/authorization-server/oauth/token`, qs.stringify(requestBody), config)

        return response.data;
    }

    async tokenIsExpired(junoToken) {
        if(!junoToken) return true;

        if(process.env.NODE_ENV === 'development') {
            return isPast(addHours(junoToken.updatedAt, 23));
        } else {
            return isPast(addMinutes(junoToken.updatedAt, 45));
        }
    }

    async updateAccountStatus(event, req) {
        if(!event.entityId) return

        const junoAccount = await JunoAccount.findOne({ where: { juno_id: event.entityId } });

        if(!junoAccount) return

        await junoAccount.update({ account_status: event.attributes.status});

        const account = await Account.findOne({
            where: {
                id: junoAccount.account_id
            },
            include: {
              model: User,
              attributes: ['id'],
            },
        });

        const notification = await Notification.create({
            target_id: account.User.id,
            sender_id: account.User.id,
            type: 'digitalAccountStatusChanged',
            type_id: account.id,
            content: 'digitalAccountStatusChanged',
        });
        
        const ownerSocket = req.connectedUsers[notification.target_id];

        if (ownerSocket) {
            req.io.to(ownerSocket).emit('notification', notification);
        }

        return
    }
}

export default new PaymentServices();