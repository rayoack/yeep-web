"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Account = require('../models/Account'); var _Account2 = _interopRequireDefault(_Account);
var _BankAccount = require('../models/BankAccount'); var _BankAccount2 = _interopRequireDefault(_BankAccount);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class BankAccountController {
  async show(req, res) {
      try {
        const bankAccount = await _BankAccount2.default.findByPk(req.params.id)

        return res.json(bankAccount)
      } catch (error) {
        return res.json(error)
      }
  }

  async store(req, res) {
      try {
        const newBankAccount = await _BankAccount2.default.create(req.body);

        return res.json(newBankAccount);
      } catch (error) {
        return res.json(error)
      }

  }

  async update(req, res) {
      try {
        const bankAccount = await _BankAccount2.default.findByPk(req.params.id)

        if(!bankAccount) return res.status(404).json({ error: 'Account not found.' });

        await bankAccount.update(req.body)

        res.json(bankAccount)
          
      } catch (error) {
        res.json(error)
      }
  }

  async delete(req, res) {
    try {
        const bankAccount = await _BankAccount2.default.findByPk(req.params.id)

        if(!bankAccount) return res.status(404).json({ error: 'Account not found.' });

        await bankAccount.destroy()

        res.json({ success: 'Account removed.' })
    } catch (error) {
        res.json(error)
    }
  }
}

exports. default = new BankAccountController();
