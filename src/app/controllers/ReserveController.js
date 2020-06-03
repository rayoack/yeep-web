import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import enUS from 'date-fns/locale/en-US';

import Reserve from '../models/Reserve';
import User from '../models/User';
import Event from '../models/Event';
import Image from '../models/Image';
import Message from '../models/Message';
import Space from '../models/Space';
import Service from '../models/Service';
// import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ReserveController {

  async index(req, res) {
    const { page } = req.params;
    let reserves = []

    if(req.body.request_type == 'space') {
      reserves = await Reserve.findAll({
        where: { space_id: req.params.id, canceled_at: null },
        order: [
          ['updatedAt', 'DESC'],
        ],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: Event,
            attributes: [
              'id',
              'title',
              'category'
            ],
            include: {
              model: Image,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });
    } else if (req.body.request_type == 'event') {

      reserves = await Reserve.findAll({
        where: { event_id: req.params.id, canceled_at: null },
        order: [
          ['updatedAt', 'DESC'],
        ],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: Space,
            attributes: [
              'id',
              'name',
              'category'
            ],
            include: {
              model: Image,
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });

    } else if (req.body.request_type == 'service') {

      reserves = await Reserve.findAll({
        where: { service_id: req.params.id, canceled_at: null },
        order: [
          ['updatedAt', 'DESC'],
        ],
        limit: 20,
        offset: (page - 1) * 20,
        include: [
          {
            model: Event,
            attributes: [
              'id',
              'title',
              'category'
            ],
            include: {
              model: Image,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });

    }

    return res.json(reserves);
  }

  async store(req, res) {
    /**
     * Validate user input data.
     */
    const schema = Yup.object().shape({
      space_id: Yup.number(),
      event_id: Yup.number(),
      service_id: Yup.number(),
      message: Yup.string(),
      amount: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    let { space_id, service_id, dates, amount, event_id, message, status } = req.body;

    let space = {}
    let service = {}

    // SPACE RESERVE ----
    if(space_id != null) {
      space = await Space.findOne({ where: { id: space_id } });

      if (!space) {
        return res.status(422).json({ error: "Space not found" });
      }

      /**
       * Check if space_id is the current user.
       */
      if (space.owner_id === req.userId) {
        return res.status(422).json({ error: "You can't create a schedule for yourself." });
      }
    }

    // SERVICE RESERVE ----
    if(service_id != null) {
      service = await Service.findOne({ where: { id: service_id } });

      if (!service) {
        return res.status(422).json({ error: "Space not found" });
      }

      /**
       * Check if service_id is the current user.
       */
      if (service.user_id === req.userId) {
        return res.status(422).json({ error: "You can't create a schedule for yourself." });
      }
    }

    /**
     * Check for past dates.
     */
    const hourStart = startOfHour(parseISO(dates[0].full_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(422).json({ error: 'Past dates are not permitted.' });
    }

    /**
     * Create reserve.
     */
    const {id: reserve_id} = await Reserve.create({
      space_id,
      service_id,
      event_id,
      message,
      amount,
      dates,
      status,
      ...req.body
    });

    /**
     * Notify appointment provider.
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: ptBR },
    );

    // const notification = await Notification.create({
    //   user:  space_id ?
    //     space.owner_id
    //     : service.user_id,
    //   target_id: reserve_id,
    //   content: `Nova reserva de ${ user.name } para ${ formattedDate }`,
    // });

    // Create first message.
    if(message == null) {
      message = `Nova reserva de ${ user.name } para ${ formattedDate }`
    }

    const newMessage = await Message.create({
      message,
      room_id: reserve_id,
      sender_id: req.userId,
      receiver_id: space_id ?
        space.owner_id
        : service.user_id,
    })

    // const ownerSocket = req.connectedUsers[notification.user];

    // if (ownerSocket) {
    //   req.io.to(ownerSocket).emit('notification', notification);
    // }

    return res.json({
      reserve_id,
      space_id,
      service_id,
      event_id,
      message,
      amount,
      dates,
      status,
      ...req.body
    });
  }

  async show(req, res) {
    const reserve = await Reserve.findByPk(req.params.id, {
      include: [
        {
          model: Event,
          attributes: ['id', 'title', 'category', 'description', 'dates'],
          include: [
            {
              model: Image,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
            {
              model: User,
              as: 'users',
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Space,
          attributes: [
            'id',
            'name',
            'description',
            'category',
            'price',
            'charge_type',
            'monetary_unit'
          ],
          include: [
            {
              model: Image,
              attributes: ['id', 'name', 'url'],
            },
          ],
        },
      ],
    });


    return res.json(reserve)
  }

  async update(req, res) {
    const reserve = await Reserve.findByPk(req.params.id, {
      include: [
        {
          model: Event,
          attributes: ['id', 'title', 'category', 'description'],
          include: [
            {
              model: Image,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
            {
              model: User,
              as: 'users',
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if(!reserve) return res.status(404).json({ error: 'Reserve not found.' })

    const isAdmin = reserve.Event.users.filter(user => user.id == req.userId)
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' })

    await reserve.update(req.body)

    return res.json(reserve);
  }

  async delete(req, res) {
    const reserve = await Reserve.findByPk(req.params.id, {
      include: [
        {
          model: Event,
          attributes: ['id', 'title', 'category', 'description'],
          include: [
            {
              model: Image,
              as: 'event_logo',
              attributes: ['id', 'name', 'url'],
            },
            {
              model: User,
              as: 'users',
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if(!reserve) return res.status(404).json({ error: 'Reserve not found.' })

    const isAdmin = reserve.Event.users.filter(user => user.id == req.userId)
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' })

    const dateWithSub = subHours(reserve.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(403).json({ error: 'You can only cancel reserve 2 hours in advance.' });
    }

    reserve.canceled_at = new Date();

    await reserve.save();

    // await Queue.add(CancellationMail.key, { reserve });

    return res.json(reserve);
  }
}

export default new ReserveController();
