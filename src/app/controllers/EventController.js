import Sequelize, { Model } from 'sequelize';
import Event from '../models/event';
import Image from '../models/Image';
import Ticket from '../models/Ticket';
import User from '../models/User';
import Reserve from '../models/Reserve';
import UsersEvents from '../models/UsersEvents';
import db from '../../database'
import * as Yup from 'yup';

class EventController {
  async index(req, res) {

    let state = req.body.state;
    let category = req.body.category;
    let online = req.body.online
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    let options = {
      where: {
        visible: true
      },
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
        {
          model: Ticket,
        },
      ],
    }

    if(state) {
      options.where.state = state
    }

    if(category) {
      options.where.category = category
    }

    if(online) {
      options.where.online = online
    }

    if(startDate && endDate) {
      options.where.start_date = {[Op.between]: [startDate, endDate]}
    }

    const events = await Event.findAll(options)

    return res.json(events)
  }

  async searchEvents(req, res) {
    const searchResults = await db.connection.queryInterface.sequelize.query(`
      SELECT *
      FROM ${Event.tableName}
      WHERE _search @@ plainto_tsquery('english', :query);
    `, {
      model: Event,
      replacements: { query: req.params.query },
    });

    return res.json(searchResults)
  }

  async show(req, res) {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Reserve,
        },
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
        {
          model: Ticket,
        },
      ],
    })

    // event.event_logo = Image.findByPk(event.logo)

    return res.json(event)
  }

  async myEvents(req, res) {

    const usersEvents = await User.findAll({
      where: { id: req.userId },
      attributes: ['id', 'name'],
      include: [
        {
          model: Event,
          as: 'events',
          // limit: 20,
          // offset: (req.params.page - 1) * 20,
          // order: ['created_at'],
          attributes: [
            'id',
            'title',
            'description',
            'category',
            'dates',
            'visible',
            'location_name',
            'adress',
            'city',
            'country',
            'state',
            'online'],
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
        },
      ]
    })

    if (usersEvents[0].events.length == 0) {
      return res.status(200).json(usersEvents[0].events);
    }

    const configuredEvents = usersEvents[0].events.map(event => {
      let adress = ''
      let final_adress = ''
      let image = event.event_logo ? event.event_logo.url : ''
      let dates = event.dates != null ? event.dates : []

      if(event.adress != null) {
        adress = `${event.adress}, ${event.city}`
        final_adress = `${event.state}, ${event.country}`
      }

      return {
        id: event.id,
        title: event.title,
        category: event.category,
        dates,
        adress,
        final_adress,
        image,
        online: event.online
      }
    })

    return res.json(configuredEvents)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      category: Yup.string().required()
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
      logo,
      dates,
      nomenclature,
      visible,
      adress,
      state,
      city,
      country,
      online,
      location_name
    } = req.body;

    const newEvent = await Event.create(req.body);

    newEvent.setUsers(req.userId)

    return res.json(newEvent);
  }

  async setEventLogo(req, res) {

    let event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name',],
          through: { attributes: [] },
        },
        {
          model: Image,
          as: 'event_images',
          attributes: ['id', 'name', 'url'],
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

    return res.json(logo);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      category: Yup.string(),
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
