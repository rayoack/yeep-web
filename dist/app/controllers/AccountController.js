"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Account = require('../models/Account'); var _Account2 = _interopRequireDefault(_Account);
var _BankAccount = require('../models/BankAccount'); var _BankAccount2 = _interopRequireDefault(_BankAccount);
var _JunoAccount = require('../models/JunoAccount'); var _JunoAccount2 = _interopRequireDefault(_JunoAccount);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class AccountController {
  async index(req, res) {
      try {
        const accounts = await _Account2.default.findAll({
            where: {
                user_id: req.userId
            },
            order: [
                ['created_at', 'DESC'],
            ],
            include: [
                {
                    model: _BankAccount2.default
                },
                {
                    model: _JunoAccount2.default
                },
            ],
        })
    
        return res.json(accounts)
          
      } catch (error) {
        return res.json(error)
      }

  }

  async show(req, res) {
      try {
        const account = await _Account2.default.findByPk(req.params.id,{
            include: [
                {
                    model: _BankAccount2.default
                },
                {
                    model: _JunoAccount2.default
                },
            ],
        })

        return res.json(account)
      } catch (error) {
        return res.json(error)
      }
  }

  async store(req, res) {
      try {
        
        const account = await _Account2.default.findOne({
            where: {
                user_id: req.userId,
                default: true
            }
        })

        let newAccountBody = req.body;

        if(!account) {
          newAccountBody.default = true;
        }

        const newAccount = await _Account2.default.create(newAccountBody);

        return res.json(newAccount);
      } catch (error) {
        return res.json(error)
      }

  }

  async update(req, res) {
      try {
        const account = await _Account2.default.findByPk(req.params.id)

        if(!account) return res.status(404).json({ error: 'Account not found.' });

        if(req.userId !== account.user_id) return res.status(401).json({ error: 'Not authorized.' });

        await account.update(req.body)

        res.json(account)
          
      } catch (error) {
        res.json(error)
      }
  }

  async delete(req, res) {
    try {
        const account = await _Account2.default.findByPk(req.params.id,{
            include: [
                {
                    model: _BankAccount2.default
                },
            ],
        })

        if(!account) return res.status(404).json({ error: 'Account not found.' });

        if(req.userId !== account.user_id) return res.status(401).json({ error: 'Not authorized.' });

        await account.destroy()

        res.json({ success: 'Account removed.' })
    } catch (error) {
        res.json(error)
    }
  }
}

exports. default = new AccountController();
