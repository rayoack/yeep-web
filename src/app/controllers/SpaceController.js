import Space from '../models/Space';
import Image from '../models/Image';
import * as Yup from 'yup';
import { Op } from 'sequelize'

class SpaceController {
  async index(req, res) {
    let state = req.body.state;
    let category = req.body.category;
    let hasParking = req.body.hasParking
    let chargeType = req.body.chargeType
    let capacityMin = req.body.capacityMin;
    let capacityMax = req.body.capacityMax;
    let priceMin = req.body.priceMin;
    let priceMax = req.body.priceMax;

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

    if(priceMin && priceMax) {
      options.where.price = {[Op.between]: [priceMin, priceMax]}
    }

    const spaces = await Space.findAll(options)

    return res.json(spaces)
  }

  async show(req, res) {
    const space = await Space.findByPk(req.params.id, {
      include: [
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
      adress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      description: Yup.string(),
      category: Yup.string().required(),
      price: Yup.number(),
      charge_type: Yup.string(),
      capacity: Yup.number(),
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
      close_hour, } = req.body;

    const newSpace = await Space.create({
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
      owner_id: req.userId
    });

    return res.json(newSpace);
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
