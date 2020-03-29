import * as Yup from 'yup';

import User from '../models/User';
import Image from '../models/Image';

class UserController {
  async store(req, res) {
    /**
     * Validate user input data.
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      role: Yup.string().required(),
      adress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      avatar_id: Yup.number(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    /**
     * Checks if the user already exists.
     */
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(422).json({ error: 'User already exists.' });
    }

    /**
     * Create a new user.
     */
    const {
      id,
      name,
      email,
      role,
      adress,
      city,
      state,
      country,
      avatar_id, } = await User.create(req.body);

    return res.status(201).json({
      id,
      name,
      email,
      role,
      adress,
      city,
      state,
      country,
      avatar_id,
    });
  }

  async storeAvatar(req, res) {

    const user = await User.findByPk(req.userId)

    if(!user) return res.status(404).json({ error: 'User not found.' });

    const file = req.file;

    const avatar = await Image.create({
      name: file.key,
      url: file.location
    });

    await user.update({ avatar_id: avatar.id})

    return res.json(user);
  }

  async update(req, res) {
    /**
     * Validate user input data.
     */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      adress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      avatar_id: Yup.number(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6)
        .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
      confirmPassword: Yup.string()
        .when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    /**
     * Checks if the user has changed their email address to an existing one.
     */
    const {
      email,
      oldPassword,
      adress,
      city,
      state,
      country,
      avatar_id
    } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(422).json({ error: 'User already exists.' });
      }
    }

    /**
     * Checks if the user password is valid.
     */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    /**
     * Update the user data.
     */
    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: Image,
          as: 'avatar',
          attributes: ['id', 'name', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
      adress,
      city,
      state,
      country,
    });
  }
}

export default new UserController();
