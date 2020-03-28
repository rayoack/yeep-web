import Space from '../models/Space';
import Image from '../models/Image';
import User from '../models/User';
import * as Yup from 'yup';

class SpaceController {
  async index(req, res) {
    const spaces = await Space.findAll({
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

    const space = await Space.findByPk(req.params.id)

    if(!space) return res.status(404).json({ error: 'Space not found.' });

    if(space.owner_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

    await space.update(req.body)

    res.json(space)
  }
}

export default new SpaceController();