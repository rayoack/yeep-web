import Service from '../models/Service';
import Image from '../models/Image';
import * as Yup from 'yup';
import { Op } from 'sequelize'

class ServiceController {
  async index(req, res) {

    let state = req.body.state;
    let category = req.body.category;
    let chargeType = req.body.chargeType
    let priceMin = req.body.priceMin;
    let priceMax = req.body.priceMax;

    let options = {
      where: {
        visibility: true
      },
      limit: 20,
      offset: (req.params.page - 1) * 20,
      attributes: [
        'id',
        'name',
        'category',
        'description',
        'adress',
        'city',
        'state',
        'country',
        'price',
        'charge_type',
        'visibility',
        'provider_id',
        'space_id',
        'user_id',
        'created_at'
      ],
      order: ['created_at'],
      include: [
        {
          model: Image,
          as: 'service_logo',
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

    if(chargeType) {
      options.where.charge_type = chargeType
    }

    if(priceMin && priceMax) {
      options.where.price = {[Op.between]: [priceMin, priceMax]}
    }

    const services = await Service.findAll(options)

    return res.json(services)
  }

  async show(req, res) {
    const service = await Service.findByPk(req.params.id, {
      include: [
        {
          model: Image,
          as: 'service_logo',
          attributes: ['id', 'name', 'url'],
        },
        {
          model: Image,
          as: 'service_images',
          attributes: ['id', 'name', 'url'],
        },
      ],
    })

    return res.json(service)
  }

  async myServices(req, res) {
    const services = await Service.findAll({
      where: {
        user_id: req.userId,
      },
      limit: 20,
      offset: (req.params.page - 1) * 20,
      attributes: [
        'id',
        'name',
        'category',
        'description',
        'adress',
        'city',
        'state',
        'country',
        'price',
        'charge_type',
        'visibility',
        'provider_id',
        'space_id',
        'user_id',
        'created_at'
      ],
      order: ['created_at'],
      include: [
        {
          model: Image,
          as: 'service_logo',
          attributes: ['id', 'name', 'url'],
        },
      ],
    })

    return res.json(services)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      category: Yup.string().required(),
      logo_id: Yup.number(),
      description: Yup.string(),
      adress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      charge_type: Yup.string(),
      monetary_unit: Yup.string(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const {
      name,
      category,
      logo_id,
      description,
      features,
      restrictions,
      adress,
      city,
      state,
      country,
      monetary_unit,
      max_quantity,
      price,
      charge_type,
      visibility,
      provider_id,
      space_id, } = req.body;
      console.log('USER ID', req.userId)
    const newService = await Service.create({
      name,
      category,
      logo_id,
      description,
      features,
      restrictions,
      adress,
      city,
      state,
      country,
      monetary_unit,
      max_quantity,
      price,
      charge_type,
      visibility,
      provider_id,
      space_id,
      user_id: req.userId
    });

    return res.json(newService);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      category: Yup.string(),
      logo_id: Yup.number(),
      description: Yup.string(),
      adress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      charge_type: Yup.string(),
      monetary_unit: Yup.string(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const service = await Service.findByPk(req.params.id)

    if(!service) return res.status(404).json({ error: 'Service not found.' });

    if(service.user_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

    await service.update(req.body)

    res.json(service)
  }

  async delete(req, res) {
    try {
      const service = await Service.findByPk(req.params.id)

      if(!service) return res.status(404).json({ error: 'Service not found.' });

      if(service.user_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

      await service.destroy()

      res.json()
    } catch (error) {
      res.json(error)
    }
  }
}

export default new ServiceController();
