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
}

export default new ImageController();
