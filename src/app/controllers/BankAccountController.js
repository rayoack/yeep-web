import User from '../models/User';
import Account from '../models/Account';
import BankAccount from '../models/BankAccount';
import * as Yup from 'yup';

class BankAccountController {
  async show(req, res) {
      try {
        const bankAccount = await BankAccount.findByPk(req.params.id)

        return res.json(bankAccount)
      } catch (error) {
        return res.json(error)
      }
  }

  async store(req, res) {
      try {
        const newBankAccount = await BankAccount.create(req.body);

        return res.json(newBankAccount);
      } catch (error) {
        return res.json(error)
      }

  }

  async update(req, res) {
      try {
        const bankAccount = await BankAccount.findByPk(req.params.id)

        if(!bankAccount) return res.status(404).json({ error: 'Account not found.' });

        await bankAccount.update(req.body)

        res.json(bankAccount)
          
      } catch (error) {
        res.json(error)
      }
  }

  async delete(req, res) {
    try {
        const bankAccount = await BankAccount.findByPk(req.params.id)

        if(!bankAccount) return res.status(404).json({ error: 'Account not found.' });

        await bankAccount.destroy()

        res.json({ success: 'Account removed.' })
    } catch (error) {
        res.json(error)
    }
  }
}

export default new BankAccountController();
