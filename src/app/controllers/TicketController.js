import Event from '../models/event';
import Image from '../models/Image';
import User from '../models/User';
import Ticket from '../models/Ticket';
import * as Yup from 'yup';

class TicketController {
  async index(req, res) {
    const tickets = await Ticket.findAll({
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
    const ticket = await Ticket.findByPk(req.params.id)

    return res.json(ticket)
  }

  async store(req, res) {

    const newTicket = await Ticket.create(req.body);

    return res.json(newTicket);
  }

  async update(req, res) {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: Event,
          attributes: ['id'],
          include: [
            {
              model: User,
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
      const ticket = await Ticket.findByPk(req.params.id, {
        include: [
          {
            model: Event,
            attributes: ['id'],
            include: [
              {
                model: User,
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

export default new TicketController();
