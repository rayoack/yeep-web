import Image from '../models/Image';
import User from '../models/User';

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
}

export default new ImageController();
