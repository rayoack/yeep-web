"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Image = require('../models/Image'); var _Image2 = _interopRequireDefault(_Image);

// Controller para o prestador de serviços

class ProviderController {
  async index(req, res) {

    const providers = await _User2.default.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: _Image2.default,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      }],
    });
   
    return res.json(providers);
  }
}

exports. default = new ProviderController();
