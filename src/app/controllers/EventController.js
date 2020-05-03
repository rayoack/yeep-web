import Event from '../models/Event';
import Image from '../models/Image';
import User from '../models/User';
import * as Yup from 'yup';

class EventController {
  async index(req, res) {
    const Events = await Event.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
      include: [
        {
          model: Image,
          as: 'event_images',
          attributes: ['id', 'name', 'url'],
        },
        {
          model: Image,
          as: 'event_logo',
          attributes: ['id', 'name', 'url'],
        },
      ],
    })

    return res.json(Events)
  }

  async show(req, res) {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Image,
          as: 'event_images',
          attributes: ['id', 'name', 'url'],
        },
        {
          model: Image,
          as: 'event_logo',
          attributes: ['id', 'name', 'url'],
        },
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          through: { attributes: [] },
        },
      ],
    })

    // event.event_logo = Image.findByPk(event.logo)

    return res.json(event)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      category: Yup.string().required(),
      estimated_audience: Yup.number(),
      target_audience: Yup.string(),
      budget: Yup.number(),
      logo: Yup.number(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const {
      title,
      description,
      category,
      estimated_audience,
      target_audience,
      budget,
      logo } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      category,
      estimated_audience,
      target_audience,
      budget,
      logo,
    });

    newEvent.setUsers(req.userId)

    return res.json(newEvent);
  }

  async setEventLogo(req, res) {

    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name',],
          through: { attributes: [] },
        },
      ],
    })

    if(!event) return res.status(404).json({ error: 'Event not found.' });

    const isAdmin = event.users.filter(user => user.id == req.userId)
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' });

    const file = req.file;

    const logo = await Image.create({
      name: file.key,
      url: file.location
    });

    await event.update({ logo: logo.id})

    return res.json(event);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      category: Yup.string(),
      estimated_audience: Yup.number(),
      target_audience: Yup.string(),
      budget: Yup.number(),
      logo: Yup.number(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name',],
          through: { attributes: [] },
        },
      ],
    })

    if(!event) return res.status(404).json({ error: 'Event not found.' });

    const isAdmin = event.users.filter(user => user.id == req.userId)
    if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' });

    await event.update(req.body)

    res.json(event)
  }

  async delete(req, res) {
    try {
      const event = await Event.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['id', 'name',],
            through: { attributes: [] },
          },
        ],
      })

      if(!event) return res.status(404).json({ error: 'Event not found.' });

      const isAdmin = event.users.filter(user => user.id == req.userId)
      if(!isAdmin) return res.status(401).json({ error: 'Not authorized.' });

      await event.destroy()

      res.json()
    } catch (error) {
      res.json(error)
    }
  }
}

export default new EventController();
