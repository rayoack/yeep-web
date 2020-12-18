"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Space = require('../models/Space'); var _Space2 = _interopRequireDefault(_Space);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Image = require('../models/Image'); var _Image2 = _interopRequireDefault(_Image);
var _Message = require('../models/Message'); var _Message2 = _interopRequireDefault(_Message);
var _Reserve = require('../models/Reserve'); var _Reserve2 = _interopRequireDefault(_Reserve);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class MessageController {
  async index(req, res) {
    const messages = await _Message2.default.findAll({
      where: {
        room_id: req.params.id,
      },
      order: [
        ['id', 'DESC']
      ],
      include: [
        {
          model: _User2.default,
          as: 'sender',
          attributes: ['id', 'name'],
          include: {
            model: _Image2.default,
            as: 'avatar',
            attributes: ['id', 'name', 'url'],
          },
        },
        {
          model: _User2.default,
          as: 'receiver',
          attributes: ['id', 'name'],
          include: {
            model: _Image2.default,
            as: 'avatar',
            attributes: ['id', 'name', 'url'],
          },
        },
        {
          model: _Image2.default,
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

    const newMessage = await _Message2.default.create(req.body)

    req.io.to(`reserve${newMessage.room_id}`).emit('message', newMessage);

    req.io.of('/').in(`reserve${newMessage.room_id}`).clients(async (error, clients) => {

      if (error) throw error;

      if (!clients.includes(req.connectedUsers[newMessage.receiver_id])) {
        const reserve = await _Reserve2.default.findByPk(newMessage.room_id);

        await reserve.update({
          last_message_target_id: newMessage.receiver_id,
          last_message_target_read: false
        })

        const ownerSocket = req.connectedUsers[newMessage.receiver_id];

        if (ownerSocket) {
          req.io.to(ownerSocket).emit('newMessageToRoom', reserve);
        }
      }

    });

    return res.json({ succes: 'ok' });
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

exports. default = new MessageController();
