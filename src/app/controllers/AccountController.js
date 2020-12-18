import User from '../models/User';
import Account from '../models/Account';
import BankAccount from '../models/BankAccount';
import JunoAccount from '../models/JunoAccount';
import * as Yup from 'yup';

class AccountController {
  async index(req, res) {
      try {
        const accounts = await Account.findAll({
            where: {
                user_id: req.userId
            },
            order: [
                ['created_at', 'DESC'],
            ],
            include: [
                {
                    model: BankAccount
                },
                {
                    model: JunoAccount
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
        const account = await Account.findByPk(req.params.id,{
            include: [
                {
                    model: BankAccount
                },
                {
                    model: JunoAccount
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
        
        const account = await Account.findOne({
            where: {
                user_id: req.userId,
                default: true
            }
        })

        let newAccountBody = req.body;

        if(!account) {
          newAccountBody.default = true;
        }

        const newAccount = await Account.create(newAccountBody);

        return res.json(newAccount);
      } catch (error) {
        return res.json(error)
      }

  }

  async update(req, res) {
      try {
        const account = await Account.findByPk(req.params.id)

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
        const account = await Account.findByPk(req.params.id,{
            include: [
                {
                    model: BankAccount
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

export default new AccountController();
