"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Image = require('../models/Image'); var _Image2 = _interopRequireDefault(_Image);
var _Notification = require('../models/Notification'); var _Notification2 = _interopRequireDefault(_Notification);

class NotificationController {
  async index(req, res) {

    const notifications = await _Notification2.default.findAll(
      {
        where: {
          target_id: req.userId
        },
        order: [
          ['createdAt', 'DESC'],
        ],
        include: [
          {
            model: _User2.default,
            as: 'sender',
            attributes: ['id', 'name'],
            include: [
              {
                model: _Image2.default,
                as: 'avatar',
                attributes: ['id', 'name', 'url'],
              }
            ]
          }
        ],
      }
    )

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await _Notification2.default.findByPk(req.params.id)

    await notification.update({
      read: true
    })

    return res.json(notification);
  }
}

exports. default = new NotificationController();
