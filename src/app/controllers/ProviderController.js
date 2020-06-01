import User from '../models/User';
import Image from '../models/Image';

// Controller para o prestador de serviços

class ProviderController {
  async index(req, res) {

    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: Image,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      }],
    });
   
    return res.json(providers);
  }
}

export default new ProviderController();
