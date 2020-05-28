import Space from '../models/Space';
import Image from '../models/Image';
import * as Yup from 'yup';
import { Op } from 'sequelize'

class SpaceController {
  async index(req, res) {
    let country = req.query.country;
    let state = req.query.state;
    let category = req.query.category;
    let hasParking = req.query.hasParking
    let chargeType = req.query.chargeType
    let capacityMin = req.query.capacityMin;
    let capacityMax = req.query.capacityMax;
    let monetaryUnit = req.query.monetaryUnit;
    let priceMin = req.query.priceMin;
    let priceMax = req.query.priceMax;

    let options = {
      where: {
        visible: true
      },
      limit: 20,
      offset: (req.params.page - 1) * 20,
      order: [
        ['createdAt', 'DESC'],
      ],
      include: [
        {
          model: Image,
          attributes: ['id', 'name', 'url'],
        },
      ],
    }

    if(country) {
      options.where.country = country
    }

    if(state) {
      options.where.state = state
    }

    if(category) {
      options.where.category = category
    }

    if(hasParking) {
      options.where.has_parking = hasParking
    }

    if(chargeType) {
      options.where.charge_type = chargeType
    }

    if(capacityMin && capacityMax) {
      options.where.capacity = {[Op.between]: [capacityMin, capacityMax]}
    }

    if(priceMin && priceMax && monetaryUnit) {
      options.where.price = {[Op.between]: [priceMin, priceMax]}
      options.where.monetary_unit = monetaryUnit
    }

    const spaces = await Space.findAll(options)

    const mappedSpaces = spaces.map(space => {
      let adress = ''
      let images = (space['Images'] && space['Images'].length) ? space.Images : ''

      if(space.adress != null && space.adress.length) {
        adress = `${space.adress}, ${space.city}, ${space.state}`
      }

      return {
        id: space.id,
        title: space.name,
        category: space.category,
        adress,
        images,
        capacity: space.capacity,
        charge_type: space.charge_type,
        monetary_unit: space.monetary_unit,
        price: space.price,
      }
    })

    return res.json(mappedSpaces)
  }

  async show(req, res) {
    const space = await Space.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name',],
          include: [
            {
              model: Image,
              as: 'avatar',
              attributes: ['id', 'name', 'url'],
            },
          ]
        },
        {
          model: Image,
          attributes: ['id', 'name', 'url'],
        },
      ],
    })

    return res.json(space)
  }

  async mySpaces(req, res) {
    const spaces = await Space.findAll({
      where: {
        owner_id: req.userId
      },
      limit: 20,
      offset: (req.params.page - 1) * 20,
      order: [
        ['createdAt', 'DESC'],
      ],
      include: [
        {
          model: Image,
          attributes: ['id', 'name', 'url'],
        },
      ],
    })

    return res.json(spaces)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      category: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const {
      name,
      adress,
      city,
      state,
      country,
      description,
      category,
      price,
      charge_type,
      capacity,
      features,
      services,
      restrictions,
      open_hour,
      close_hour,
      has_parking,
      parking_features,
      parking_description,
      monetary_unit } = req.body;

    const newSpace = await Space.create({
      name,
      adress,
      city,
      state,
      country,
      description,
      category,
      monetary_unit,
      price,
      charge_type,
      capacity,
      features,
      services,
      restrictions,
      open_hour,
      close_hour,
      has_parking,
      parking_features,
      parking_description,
      owner_id: req.userId
    });

    return res.json(newSpace);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      category: Yup.string(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const space = await Space.findByPk(req.params.id)

    if(!space) return res.status(404).json({ error: 'Space not found.' });

    if(space.owner_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

    await space.update(req.body)

    res.json(space)
  }

  async delete(req, res) {
    try {
      const space = await Space.findByPk(req.params.id)

      if(!space) return res.status(404).json({ error: 'Space not found.' });

      if(space.owner_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

      await space.destroy()

      res.json()
    } catch (error) {
      res.json(error)
    }
  }
}

export default new SpaceController();
