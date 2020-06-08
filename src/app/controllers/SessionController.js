import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import Image from '../models/Image';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    /**
     * Validate user input data.
     */
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    /**
     * Checks if user exists.
     */
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Image,
          as: 'avatar',
          attributes: ['id', 'name', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    /**
     * Checks if user password is valid.
     */
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    const {
      id,
      name,
      avatar,
      provider,
      adress,
      city,
      state,
      country,
      role,
      mp_access_token,
      mp_refresh_token,
      mp_token_date
    } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider,
        adress,
        city,
        state,
        country,
        role,
        mp_access_token,
        mp_refresh_token,
        mp_token_date
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
