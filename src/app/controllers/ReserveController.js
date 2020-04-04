import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Reserve from '../models/Reserve';
import User from '../models/User';
import Event from '../models/Event';
import Image from '../models/Image';
import Message from '../models/Message';
import Space from '../models/Space';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ReserveController {
  async ListSpaceReserves(req, res) {
    const { page } = req.params;

    const reserves = await Reserve.findAll({
      where: { space_id: req.params.id, canceled_at: null },
      order: ['startDate'],
      attributes: [
        'id',
        'dates',
        'amount',
        'paid',
        'past',
        'cancelable',
        'approve'
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Event,
          attributes: ['id', 'title'],
          include: {
            model: Image,
            as: 'event_logo',
            attributes: ['id', 'name', 'url'],
          },
        },
      ],
    });

    return res.json(reserves);
  }

  async store(req, res) {
    /**
     * Validate user input data.
     */
    const schema = Yup.object().shape({
      space_id: Yup.number().required(),
      event_id: Yup.number().required(),
      message: Yup.string(),
      amount: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    let { space_id, dates, amount, event_id, message } = req.body;

    const space = await Space.findOne({ where: { id: space_id } });

    if (!space) {
      return res.status(422).json({ error: "Space not found" });
    }

    /**
     * Check if space_id is the current user.
     */
    if (space.owner_id === req.userId) {
      return res.status(422).json({ error: "You can't create a schedule for yourself." });
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
    const {id: reserve_id, paid} = await Reserve.create({
      space_id,
      event_id,
      message,
      amount,
      dates,
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

    await Notification.create({
      user: space.owner_id,
      target_id: reserve_id,
      content: `Nova reserva de ${ user.name } para ${ formattedDate }`,
    });

    // Create first message.
    if(message == null) {
      message = `Nova reserva de ${ user.name } para ${ formattedDate }`
    }
    console.log('AQUI', space.owner_id)
    const newMessage = await Message.create({
      message,
      room_id: reserve_id,
      sender_id: req.userId,
      receiver_id: space.owner_id,
    })

    return res.json({
      reserve_id,
      space_id,
      event_id,
      message,
      amount,
      dates,
      paid,
    });
  }

  async delete(req, res) {
    const reserve = await Reserve.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (reserve.user_id !== req.userId) {
      return res.status(403).json({ error: "You don't have permission to cancel this reserve." });
    }

    const dateWithSub = subHours(reserve.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(403).json({ error: 'You can only cancel reserve 2 hours in advance.' });
    }

    reserve.canceled_at = new Date();

    await reserve.save();

    await Queue.add(CancellationMail.key, { reserve });

    return res.json(reserve);
  }
}

export default new ReserveController();
