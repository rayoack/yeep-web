import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import enUS from 'date-fns/locale/en-US';

import Reserve from '../models/Reserve';
import User from '../models/User';
import Event from '../models/event';
import Image from '../models/Image';
import Message from '../models/Message';
import Space from '../models/Space';
import Service from '../models/Service';
import Notification from '../models/Notification';

class ReserveController {

  async index(req, res) {
    const { page } = req.params;
    let reserves = []

    if(req.query.request_type == 'space') {
      reserves = await Reserve.findAll({
        where: { space_id: req.params.id },
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
    } else if (req.query.request_type == 'event') {

      reserves = await Reserve.findAll({
        where: { event_id: req.params.id },
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
              'category',
              'adress',
              'city',
              'state',
              'state',
              'country',
            ],
            include: {
              model: Image,
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });

    } else if (req.query.request_type == 'organizer') {

      reserves = await Reserve.findAll({
        where: { organizer_id: req.params.id },
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
              'category',
              'adress',
              'city',
              'state',
              'state',
              'country',
            ],
            include: {
              model: Image,
              attributes: ['id', 'name', 'url'],
            },
          },
        ],
      });
    } else if (req.query.request_type == 'host') {
      reserves = await Reserve.findAll({
        where: { host_id: req.params.id },
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
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    let {
      space_id,
      quantity,
      amount,
      message,
      status,
    } = req.body;

    let space = {}

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

    /**
     * Create reserve.
     */
    const newReserve = await Reserve.create({
      space_id,
      host_id: space.owner_id,
      organizer_id: req.userId,
      message,
      amount,
      quantity,
      status,
      ...req.body
    });

    /**
     * Notify appointment provider.
     */
    const notification = await Notification.create({
      target_id: space.owner_id,
      sender_id: req.userId,
      type: 'newSpaceReserve',
      type_id: newReserve.id,
      content: space.name,
    });

    const ownerSocket = req.connectedUsers[notification.target_id];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('notification', notification);
    }

    // Create first message.
    if(message == null) {
      message = `newReserveSolicitation`
    }

    const newMessage = await Message.create({
      message,
      room_id: newReserve.id,
      sender_id: req.userId,
      receiver_id: space.owner_id,
    })

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('newReserve', newReserve);
    }

    return res.json({
      reserve_id: newReserve,
      space_id,
      host_id: space.owner_id,
      organizer_id: req.userId,
      message,
      amount,
      quantity,
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

    const isAdmin = reserve.organizer_id === req.userId;
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

    const isAdmin = reserve.organizer_id === req.userId;
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' })

    // const dateWithSub = subHours(reserve.date, 2);

    // if (isBefore(dateWithSub, new Date())) {
    //   return res.status(403).json({ error: 'You can only cancel reserve 2 hours in advance.' });
    // }

    reserve.canceled_at = new Date();

    await reserve.save();

    // await Queue.add(CancellationMail.key, { reserve });

    return res.json(reserve);
  }
}

export default new ReserveController();
