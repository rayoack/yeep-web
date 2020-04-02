import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Appointment from '../models/Reserve';
import User from '../models/User';
import Event from '../models/Event';
import Image from '../models/Image';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async ListSpaceAppointments(req, res) {
    const { page } = req.params;

    const appointments = await Appointment.findAll({
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

    return res.json(appointments);
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
      paid: Yup.boolean(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const { space_id, dates } = req.body;

    const space = await User.findOne({ where: { id: space_id } });

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
    const hourStart = startOfHour(parseISO(dates[0].fullDate));

    if (isBefore(hourStart, new Date())) {
      return res.status(422).json({ error: 'Past dates are not permitted.' });
    }

    /**
     * Check date availability.
     */
    const spaceReserves = await Appointment.findOne({
      where: {
        space_id,
        canceled_at: null,
      },
    });

    const checkAvailability = spaceReserves.map(reserve => {
      reserve.dates
    })

    if (checkAvailability) {
      return res.status(422).json({ error: 'Appointment date is not available.' });
    }

    /**
     * Create appointment.
     */
    const appointment = await Appointment.create({
      user_id: req.userId,
      space_id,
      date: hourStart,
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
      content: `Novo agendamento de ${ user.name } para ${ formattedDate }`,
      user: space_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
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

    if (appointment.user_id !== req.userId) {
      return res.status(403).json({ error: "You don't have permission to cancel this appointment." });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(403).json({ error: 'You can only cancel appointments 2 hours in advance.' });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
