import Image from '../models/Image';
import User from '../models/User';
import Service from '../models/Service';

class ImageController {
  async storeAvatar(req, res) {

    const user = await User.findByPk(req.userId)

    if(!user) return res.status(404).json({ error: 'User not found.' });

    const file = req.file;

    const avatar = await Image.create({
      name: file.key,
      url: file.location
    });

    await user.update({ avatar_id: avatar.id})

    return res.json(user);
  }

  async spaceImages(req, res) {

    const file = req.files;
    try {
      file.map(async item => {
        const { id, name, url, space_id } = await Image.create({
          name: item.key,
          url: item.location,
          space_id: req.params.id
        });
      })

      return res.json();
    } catch (error) {
      res.json(error)
    }
  }

  async eventsImages(req, res) {

    const file = req.files;
    try {
      file.map(async item => {
        const { id, name, url, event_id } = await Image.create({
          name: item.key,
          url: item.location,
          event_id: req.params.id
        });
      })

      return res.json();
    } catch (error) {
      res.json(error)
    }
  }

  async serviceImages(req, res) {

    const file = req.files;
    try {
      file.map(async item => {
        const { id, name, url, service_id } = await Image.create({
          name: item.key,
          url: item.location,
          service_id: req.params.id
        });
      })

      return res.json();
    } catch (error) {
      res.json(error)
    }
  }

  async setServiceLogo(req, res) {

    const service = await Service.findByPk(req.params.id)

    if(!service) return res.status(404).json({ error: 'Service not found.' });

    if(service.user_id != req.userId) return res.status(401).json({ error: 'Not authorized.' });

    const file = req.file;

    const logo = await Image.create({
      name: file.key,
      url: file.location
    });

    await service.update({ logo_id: logo.id})

    return res.json(service);
  }

  async delete(req, res) {
    try {
      const image = await Image.findByPk(req.params.id)

      if(!image) return res.status(404).json({ error: 'Image not found.' });

      await image.destroy()

      res.json()
    } catch (error) {
      res.json(error)
    }
  }
}

export default new ImageController();
