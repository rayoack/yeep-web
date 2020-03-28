import Image from '../models/Image';

class ImageController {
  async storeAvatar(req, res) {
    
    const file = req.file;

    const avatar = await Image.create({
      name: file.key,
      url: file.location
    });

    return res.json(avatar);
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
