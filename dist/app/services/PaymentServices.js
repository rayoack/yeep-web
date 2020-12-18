"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _sequelize = require('sequelize');
var _isPast = require('date-fns/isPast'); var _isPast2 = _interopRequireDefault(_isPast);
var _addMinutes = require('date-fns/addMinutes'); var _addMinutes2 = _interopRequireDefault(_addMinutes);
var _addHours = require('date-fns/addHours'); var _addHours2 = _interopRequireDefault(_addHours);
var _JunoAccount = require('../models/JunoAccount'); var _JunoAccount2 = _interopRequireDefault(_JunoAccount);
var _Account = require('../models/Account'); var _Account2 = _interopRequireDefault(_Account);
var _JunoToken = require('../models/JunoToken'); var _JunoToken2 = _interopRequireDefault(_JunoToken);
var _Notification = require('../models/Notification'); var _Notification2 = _interopRequireDefault(_Notification);

var _BankAccount = require('../models/BankAccount'); var _BankAccount2 = _interopRequireDefault(_BankAccount);
var _qs = require('qs'); var _qs2 = _interopRequireDefault(_qs);
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _payments = require('../utils/payments');

class PaymentServices {
    async getAccessToken() {
        const junoToken = await _JunoToken2.default.findAll({
          where: {
            access_token: {
                [_sequelize.Op.not]: null
            }
          },
        })

        if(!junoToken[0]) {
            const newAccessToken = await this.getAccessTokenFromJunoApi();

            const tokenDataCreated = await _JunoToken2.default.create({
                access_token: newAccessToken.access_token,
            });

            return tokenDataCreated.access_token;
        } else {
            const isTokenExpired = await this.tokenIsExpired(junoToken[0]);

            if(isTokenExpired || !junoToken[0].access_token) {
                const newAccessToken = await this.getAccessTokenFromJunoApi();

                const tokenDataUpdated = await _JunoToken2.default.update({
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

        const response = await _axios2.default.post(`${_payments.junoUrlBaseAuthorization}/authorization-server/oauth/token`, _qs2.default.stringify(requestBody), config)

        return response.data;
    }

    async tokenIsExpired(junoToken) {
        if(!junoToken) return true;

        if(process.env.NODE_ENV === 'development') {
            return _isPast2.default.call(void 0, _addHours2.default.call(void 0, junoToken.updatedAt, 23));
        } else {
            return _isPast2.default.call(void 0, _addMinutes2.default.call(void 0, junoToken.updatedAt, 45));
        }
    }

    async updateAccountStatus(event, req) {
        if(!event.entityId) return

        const junoAccount = await _JunoAccount2.default.findOne({ where: { juno_id: event.entityId } });

        if(!junoAccount) return

        await junoAccount.update({ account_status: event.attributes.status});

        const account = await _Account2.default.findOne({
            where: {
                id: junoAccount.account_id
            },
            include: {
              model: _User2.default,
              attributes: ['id'],
            },
        });

        const notification = await _Notification2.default.create({
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

exports. default = new PaymentServices();