"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Notification = require('../schemas/Notification'); var _Notification2 = _interopRequireDefault(_Notification);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);


class NotificationController {
  async index(req, res) {

    const notifications = await _Notification2.default.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' }).limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await _Notification2.default.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }, // Return the updated object.
    );

    return res.json(notification);
  }
}

exports. default = new NotificationController();
