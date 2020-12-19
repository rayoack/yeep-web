"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Event = require('../models/event'); var _Event2 = _interopRequireDefault(_Event);
var _Image = require('../models/Image'); var _Image2 = _interopRequireDefault(_Image);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Ticket = require('../models/Ticket'); var _Ticket2 = _interopRequireDefault(_Ticket);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

class TicketController {
  async index(req, res) {
    const tickets = await _Ticket2.default.findAll({
      where: {
        event_id: req.body.event_id
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    })

    return res.json(tickets)
  }

  async show(req, res) {
    const ticket = await _Ticket2.default.findByPk(req.params.id)

    return res.json(ticket)
  }

  async store(req, res) {

    const newTicket = await _Ticket2.default.create(req.body);

    return res.json(newTicket);
  }

  async update(req, res) {
    const ticket = await _Ticket2.default.findByPk(req.params.id, {
      include: [
        {
          model: _Event2.default,
          attributes: ['id'],
          include: [
            {
              model: _User2.default,
              as: 'users',
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    })

    if(!ticket) return res.status(404).json({ error: 'Ticket not found.' });

    const isAdmin = ticket.Event.users.filter(user => user.id == req.userId)
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' });

    await ticket.update(req.body)

    res.json(ticket)
  }

  async delete(req, res) {
    try {
      const ticket = await _Ticket2.default.findByPk(req.params.id, {
        include: [
          {
            model: _Event2.default,
            attributes: ['id'],
            include: [
              {
                model: _User2.default,
                as: 'users',
                attributes: ['id', 'name'],
                through: { attributes: [] },
              },
            ],
          },
        ],
      })

      if(!ticket) return res.status(404).json({ error: 'Ticket not found.' });

      const isAdmin = ticket.Event.users.filter(user => user.id == req.userId)
      if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' });

      await ticket.destroy()

      res.json()
    } catch (error) {
      res.json(error)
    }
  }
}

exports. default = new TicketController();
