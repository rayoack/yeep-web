"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Space = require('../models/Space'); var _Space2 = _interopRequireDefault(_Space);
var _Message = require('../models/Message'); var _Message2 = _interopRequireDefault(_Message);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class MessageController {
  async index(req, res) {
    const messages = await _Message2.default.findAll({
      where: {
        room_id: req.params.id,
      },
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

exports. default = new MessageController();
