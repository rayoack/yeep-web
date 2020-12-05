import User from '../models/User';
import { Op } from "sequelize";
import isPast from 'date-fns/isPast'
import addMinutes from 'date-fns/addMinutes'
import addHours from 'date-fns/addHours'
import JunoAccount from '../models/JunoAccount';
import JunoToken from '../models/JunoToken';
import Account from '../models/Account';
import BankAccount from '../models/BankAccount';
import qs from 'qs';
import axios from 'axios';
import { junoUrlBase } from '../utils/payments'

class PaymentServices {
    async getAccessToken(id) {
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
                console.log('okkkkkkkkkk')
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

        const response = await axios.post(`${junoUrlBase}/authorization-server/oauth/token`, qs.stringify(requestBody), config)

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
}

export default new PaymentServices();