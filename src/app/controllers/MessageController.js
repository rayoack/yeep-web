import Space from '../models/Space';
import User from '../models/User';
import Image from '../models/Image';
import Message from '../models/Message';
import Notification from '../models/Notification';
import * as Yup from 'yup';

class MessageController {
  async index(req, res) {
    const messages = await Message.findAll({
      where: {
        room_id: req.params.id,
      },
      order: [
        ['id', 'DESC']
      ],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name'],
          include: {
            model: Image,
            as: 'avatar',
            attributes: ['id', 'name', 'url'],
          },
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name'],
          include: {
            model: Image,
            as: 'avatar',
            attributes: ['id', 'name', 'url'],
          },
        },
        {
          model: Image,
          attributes: ['id', 'name', 'url'],
        },
      ]
    })


    return res.json(messages)
  }

  async show(req, res) {
    return res.json()
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      message: Yup.string().required(),
      room_id: Yup.number().required(),
      sender_id: Yup.number().required(),
      receiver_id: Yup.number(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const newMessage = await Message.create(req.body)

    req.io.to(`reserve${newMessage.room_id}`).emit('message', newMessage);

    let notification = await Notification.create({
      target_id: newMessage.receiver_id,
      sender_id: newMessage.sender_id,
      type: 'newMessage',
      type_id: newMessage.room_id,
      content: newMessage.message,
    });

    const ownerSocket = req.connectedUsers[notification.target_id];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }

    return res.json(newMessage);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      adress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      description: Yup.string(),
      category: Yup.string(),
      price: Yup.number(),
      charge_type: Yup.string(),
      capacity: Yup.number(),
    });

    res.json()
  }

  async delete(req, res) {
    res.json()
  }
}

export default new MessageController();
