"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Service = require('../models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _Image = require('../models/Image'); var _Image2 = _interopRequireDefault(_Image);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _sequelize = require('sequelize');

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
          model: _Image2.default,
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
      options.where.price = {[_sequelize.Op.between]: [priceMin, priceMax]}
    }

    const services = await _Service2.default.findAll(options)

    return res.json(services)
  }

  async show(req, res) {
    const service = await _Service2.default.findByPk(req.params.id, {
      include: [
        {
          model: _Image2.default,
          as: 'service_logo',
          attributes: ['id', 'name', 'url'],
        },
        {
          model: _Image2.default,
          as: 'service_images',
          attributes: ['id', 'name', 'url'],
        },
      ],
    })

    return res.json(service)
  }

  async myServices(req, res) {
    const services = await _Service2.default.findAll({
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
          model: _Image2.default,
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
    const newService = await _Service2.default.create({
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

    const service = await _Service2.default.findByPk(req.params.id)

    if(!service) return res.status(404).json({ error: 'Service not found.' });

    if(service.user_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

    await service.update(req.body)

    res.json(service)
  }

  async delete(req, res) {
    try {
      const service = await _Service2.default.findByPk(req.params.id)

      if(!service) return res.status(404).json({ error: 'Service not found.' });

      if(service.user_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

      await service.destroy()

      res.json()
    } catch (error) {
      res.json(error)
    }
  }
}

exports. default = new ServiceController();
